// Payment Verification Edge Function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getFirstString(candidate: unknown): string | null {
  return typeof candidate === 'string' && candidate.trim().length > 0 ? candidate : null;
}

function extractGatewayMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const data = payload as Record<string, unknown>;

  const messageField = data['message'];
  const descriptionField = data['description'];
  const errorField = data['error'];

  const directMessage =
    getFirstString(messageField) ??
    getFirstString(descriptionField) ??
    getFirstString(errorField) ??
    (typeof messageField === 'object' && messageField
      ? getFirstString((messageField as Record<string, unknown>)['description']) ??
        getFirstString((messageField as Record<string, unknown>)['status'])
      : null);

  if (directMessage) {
    return directMessage;
  }

  const nestedData = data['data'] as Record<string, unknown> | undefined;

  if (nestedData) {
    const collection = nestedData['collection'] as Record<string, unknown> | undefined;
    if (collection) {
      const collectionMessage = collection['message'] as Record<string, unknown> | undefined;
      const collectionData = collection['data'] as Record<string, unknown> | undefined;

      const collectionMessageText =
        (collectionMessage &&
          (getFirstString(collectionMessage['description']) ?? getFirstString(collectionMessage['status']))) ?? null;

      if (collectionMessageText) {
        return collectionMessageText;
      }

      if (collectionData) {
        const collectionDataText =
          getFirstString(collectionData['description']) ??
          getFirstString(collectionData['status']) ??
          getFirstString(collectionData['actioncode']);

        if (collectionDataText) {
          return collectionDataText;
        }
      }
    }

    const nameEnquiry = nestedData['nameEnquiry'] as Record<string, unknown> | undefined;
    if (nameEnquiry) {
      const nameEnquiryMessage = nameEnquiry['message'] as Record<string, unknown> | undefined;
      const nameEnquiryData = nameEnquiry['data'] as Record<string, unknown> | undefined;

      const nameEnquiryMessageText =
        (nameEnquiryMessage &&
          (getFirstString(nameEnquiryMessage['description']) ?? getFirstString(nameEnquiryMessage['status']))) ?? null;

      if (nameEnquiryMessageText) {
        return nameEnquiryMessageText;
      }

      if (nameEnquiryData) {
        const nameEnquiryDataText =
          getFirstString(nameEnquiryData['description']) ??
          getFirstString(nameEnquiryData['status']) ??
          getFirstString(nameEnquiryData['actcode']) ??
          getFirstString(nameEnquiryData['actioncode']);

        if (nameEnquiryDataText) {
          return nameEnquiryDataText;
        }
      }
    }
  }

  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const body = req.method === 'GET' ? {} : await req.json().catch(() => ({}));

    const registrationId = (body?.registration_id as string)
      ?? (body?.registrationId as string)
      ?? pathParts[pathParts.length - 1];
    
    const reference = body?.reference as string | undefined;
    const altReferences = Array.isArray(body?.alt_references)
      ? (body?.alt_references as unknown[]).filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      : [];

    if (!registrationId) {
      return new Response(
        JSON.stringify({ success: false, error: 'registration_id is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase environment variables are not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: registration, error } = await supabase
      .from('registrations')
      .select('id, payment_status, created_at')
      .eq('id', registrationId)
      .single();

    if (error || !registration) {
      return new Response(
        JSON.stringify({ success: false, error: 'Registration not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        },
      );
    }

    // If already confirmed, return success immediately
    if (registration.payment_status === 'confirmed' || registration.payment_status === 'paid') {
      return new Response(
        JSON.stringify({
          success: true,
          registration_id: registrationId,
          status: registration.payment_status,
          is_confirmed: true,
          is_failed: false,
          created_at: registration.created_at,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    }

    const referencesToCheck = [reference, ...altReferences].filter((value, index, arr): value is string => {
      if (!value) return false;
      return arr.indexOf(value) === index;
    });

    if (referencesToCheck.length > 0 && registration.payment_status === 'pending') {
      const paymentApiUrl = Deno.env.get('PAYMENT_API_URL') ?? 'http://54.86.149.215/pay';

      for (const currentReference of referencesToCheck) {
        if (!currentReference) continue;

        console.log('Verifying payment with gateway:', { registrationId, reference: currentReference });
        
        const verifyUrls = [
          `${paymentApiUrl}/verify/${currentReference}`,
          `${paymentApiUrl}/verify?reference=${encodeURIComponent(currentReference)}`,
        ];
        const requestBodies = [
          undefined,
          JSON.stringify({ reference: currentReference }),
          JSON.stringify({ transactionId: currentReference }),
        ];
        
        let verifyData: Record<string, unknown> = {};
        let lastError: unknown = null;

        for (const verifyUrl of verifyUrls) {
          try {
            const verifyResponse = await fetch(verifyUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            let verifyRawBody = await verifyResponse.text();
            try {
              verifyData = verifyRawBody ? JSON.parse(verifyRawBody) : {};
            } catch (_error) {
              console.error('Failed to parse verification response:', verifyRawBody);
              verifyData = { raw: verifyRawBody };
            }

            console.log('Gateway verification response (GET):', { url: verifyUrl, status: verifyResponse.status, data: verifyData });

            if (verifyResponse.ok) {
              break;
            }

            lastError = `GET ${verifyUrl} returned status ${verifyResponse.status}`;
          } catch (error) {
            console.error('Gateway verification GET error:', error);
            lastError = error;
          }
        }

        if (!verifyData || Object.keys(verifyData).length === 0) {
          for (const requestBody of requestBodies) {
            try {
              const verifyResponse = await fetch(`${paymentApiUrl}/verify`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: requestBody,
              });

              let verifyRawBody = await verifyResponse.text();
              try {
                verifyData = verifyRawBody ? JSON.parse(verifyRawBody) : {};
              } catch (_error) {
                console.error('Failed to parse verification response:', verifyRawBody);
                verifyData = { raw: verifyRawBody };
              }

              console.log('Gateway verification response (POST):', { payload: requestBody, status: verifyResponse.status, data: verifyData });

              if (verifyResponse.ok) {
                break;
              }

              lastError = `POST verify returned status ${verifyResponse.status}`;
            } catch (error) {
              console.error('Gateway verification POST error:', error);
              lastError = error;
            }
          }
        }

        const possibleStatusStrings = [
          (verifyData?.status as string) ?? null,
          (verifyData?.paymentStatus as string) ?? null,
          (verifyData?.transactionStatus as string) ?? null,
          (verifyData as Record<string, unknown>)?.message as string ?? null,
          ((verifyData?.data as Record<string, unknown>)?.status as string) ?? null,
          (((verifyData?.data as Record<string, unknown>)?.collection as Record<string, unknown>)?.status as string) ?? null,
          ((((verifyData?.data as Record<string, unknown>)?.collection as Record<string, unknown>)?.message as Record<string, unknown>)?.status as string) ?? null,
          ((((verifyData?.data as Record<string, unknown>)?.collection as Record<string, unknown>)?.message as Record<string, unknown>)?.description as string) ?? null,
        ]
          .filter((value): value is string => Boolean(value))
          .map((value) => value.toLowerCase());

        const gatewaySuccess =
          verifyData?.success === true ||
          possibleStatusStrings.some((status) =>
            ['success', 'completed', 'paid', 'confirmed', '200', '000', 'transaction completed', 'transaction successful'].some((keyword) => status.includes(keyword))
          );

        if (gatewaySuccess) {
          const { error: updateError } = await supabase
            .from('registrations')
            .update({
              payment_status: 'confirmed',
            })
            .eq('id', registrationId);

          if (updateError) {
            console.error('Failed to update registration status:', updateError);
          } else {
            console.log('Payment confirmed for registration:', registrationId, 'using reference:', currentReference);
          }

          return new Response(
            JSON.stringify({
              success: true,
              registration_id: registrationId,
              status: 'confirmed',
              is_confirmed: true,
              is_failed: false,
              message: 'Payment confirmed',
              reference_used: currentReference,
              gateway_response: verifyData,
              created_at: registration.created_at,
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            },
          );
        }

        const failureKeywords = [
          'failed',
          'declined',
          'cancelled',
          'error',
          'could not process',
          '-200',
          'insufficient',
          'timeout',
          'expired',
        ];

        const matchingFailureStatus = possibleStatusStrings.find((status) =>
          failureKeywords.some((keyword) => status.includes(keyword))
        );

        const isPaymentFailed = Boolean(matchingFailureStatus);

        if (isPaymentFailed) {
          const failureMessage =
            extractGatewayMessage(verifyData) ??
            (matchingFailureStatus ? matchingFailureStatus : null) ??
            'Payment failed or was cancelled';

          return new Response(
            JSON.stringify({
              success: true,
              registration_id: registrationId,
              status: 'failed',
              is_confirmed: false,
              is_failed: true,
              message: failureMessage,
              reference_used: currentReference,
              gateway_response: verifyData,
              failure_reason: failureMessage,
              created_at: registration.created_at,
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            },
          );
        }

        if (lastError) {
          console.warn('Gateway verification did not return a definitive status', {
            reference: currentReference,
            lastError,
            verifyData,
          });
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          registration_id: registrationId,
          status: 'pending',
          is_confirmed: false,
          is_failed: false,
          message: 'Payment is still being processed',
          gateway_response: null,
          created_at: registration.created_at,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    }
    
    // No reference provided or not pending, return current status
    const isConfirmed = registration.payment_status === 'confirmed' || registration.payment_status === 'paid';
    const isFailed = registration.payment_status === 'failed';

    return new Response(
      JSON.stringify({
        success: true,
        registration_id: registrationId,
        status: registration.payment_status,
        is_confirmed: isConfirmed,
        is_failed: isFailed,
        message: isConfirmed ? 'Payment confirmed' : 'Payment status unknown',
        created_at: registration.created_at,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Payment verification error', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Payment verification failed',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  }
});



