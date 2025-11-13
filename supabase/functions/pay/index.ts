// Payment Initiation Edge Function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const networkMap: Record<string, string> = {
  "300591": "mtn",
  "300592": "airteltigo",
  "300594": "telecel",
  "mtn": "mtn",
  "mt": "mtn",
  "mtn mobile money": "mtn",
  "airteltigo": "airteltigo",
  "airteltigo money": "airteltigo",
  "airtel": "airteltigo",
  "airtel tigo": "airteltigo",
  "telecel": "telecel",
  "telecel cash": "telecel",
};

function normalizeNetwork(value?: string): string {
  if (!value) return "mtn";
  const trimmed = value.toLowerCase().trim();
  return networkMap[trimmed] ?? "mtn";
}

function normalizeAccountNumber(value: string): string {
  let cleaned = value.replace(/\s+/g, "");

  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  }

  if (cleaned.startsWith("0")) {
    cleaned = `233${cleaned.substring(1)}`;
  }

  return cleaned;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { event_id, registration_id, account_number, account_name, amount, narration, network } = await req.json();

    if (!event_id || !registration_id || !account_number || !account_name || !amount) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields: event_id, registration_id, account_number, account_name, amount",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    const paymentApiUrl = Deno.env.get("PAYMENT_API_URL") ?? "http://54.86.149.215/pay";

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase environment variables are not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const normalisedNetwork = normalizeNetwork(network);
    const apiAccountNumber = normalizeAccountNumber(account_number);
    const amountAsNumber = typeof amount === "string" ? parseFloat(amount) : amount;
    const amountAsString = amountAsNumber.toFixed(2);

    const payload = {
      accountNumber: apiAccountNumber,
      amount: amountAsString,
      narration: narration ?? "Games & Connect - Event Payment",
      network: normalisedNetwork,
    };

    console.log("========================================");
    console.log("=== PAYMENT INITIATION REQUEST ===");
    console.log("Registration ID:", registration_id);
    console.log("Payment API URL:", paymentApiUrl);
    console.log("Payload:", JSON.stringify(payload, null, 2));
    console.log("========================================");

    const paymentResponse = await fetch(paymentApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const rawBody = await paymentResponse.text();
    let parsedBody: Record<string, unknown> = {};

    try {
      parsedBody = rawBody ? JSON.parse(rawBody) : {};
    } catch (parseError) {
      console.error("Failed to parse payment response as JSON:", parseError);
      parsedBody = { raw: rawBody };
    }

    console.log("========================================");
    console.log("=== PAYMENT API RESPONSE ===");
    console.log("HTTP Status:", paymentResponse.status);
    console.log("Status Text:", paymentResponse.statusText);
    console.log("Raw Body:", rawBody);
    console.log("Parsed Body:", JSON.stringify(parsedBody, null, 2));
    console.log("========================================");

    if (!paymentResponse.ok) {
      const message = (parsedBody?.message as string) ?? (parsedBody?.error as string) ?? rawBody ?? "Payment API error";

      console.error("Payment API returned non-2xx status", {
        status: paymentResponse.status,
        statusText: paymentResponse.statusText,
        message,
      });

      return new Response(
        JSON.stringify({
          success: false,
          registration_id,
          error: `Payment request failed (${paymentResponse.status}): ${message}`,
          status: paymentResponse.status,
          response: parsedBody,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    const dataSection = (parsedBody?.data as Record<string, unknown>) ?? {};
    const collectionSection = (dataSection?.collection as Record<string, unknown>) ?? {};
    const collectionData = (collectionSection?.data as Record<string, unknown>) ?? {};
    const nameEnquirySection = (dataSection?.nameEnquiry as Record<string, unknown>) ?? {};
    const nameEnquiryData = (nameEnquirySection?.data as Record<string, unknown>) ?? {};

    const collectionTransactionId =
      (parsedBody?.collectionTransactionID as string) ??
      (parsedBody?.collection_transaction_id as string) ??
      (collectionData?.transactionId as string) ??
      (collectionSection?.transactionId as string) ??
      null;

    const transactionId =
      (parsedBody?.transactionId as string) ??
      (parsedBody?.transaction_id as string) ??
      (parsedBody?.TransactionID as string) ??
      (collectionSection?.transactionId as string) ??
      null;

    const nameEnquiryTransactionId =
      (parsedBody?.nameEnquiryTransactionID as string) ??
      (nameEnquiryData?.transactionID as string) ??
      null;

    const additionalReferencesCandidates = [
      collectionTransactionId,
      transactionId,
      nameEnquiryTransactionId,
      (parsedBody?.reference as string) ?? null,
    ];

    const allReferences = additionalReferencesCandidates
      .filter((value): value is string => Boolean(value))
      .filter((value, index, arr) => arr.indexOf(value) === index);

    const transactionReference = allReferences[0] ?? registration_id;

    console.log("========================================");
    console.log("=== PAYMENT INITIATION SUCCESS ===");
    console.log("Registration ID:", registration_id);
    console.log("Transaction Reference:", transactionReference);
    console.log("Available fields in response:");
    console.log("  - transactionId:", parsedBody?.transactionId);
    console.log("  - transaction_id:", parsedBody?.transaction_id);
    console.log("  - reference:", parsedBody?.reference);
    console.log("  - TransactionID:", parsedBody?.TransactionID);
    console.log("  - nameEnquiryTransactionID:", parsedBody?.nameEnquiryTransactionID);
    console.log("  - collectionTransactionID:", parsedBody?.collectionTransactionID);
    console.log("All references considered:", allReferences);
    console.log("Registration should remain in 'pending' status");
    console.log("========================================");

    return new Response(
      JSON.stringify({
        success: true,
        registration_id,
        transaction_reference: transactionReference,
        collection_transaction_id: collectionTransactionId,
        transaction_id: transactionId,
        name_enquiry_transaction_id: nameEnquiryTransactionId,
        references: allReferences,
        response: parsedBody,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("========================================");
    console.error("=== PAYMENT FUNCTION ERROR ===");
    console.error("Error Type:", error?.constructor?.name);
    console.error("Error Message:", error instanceof Error ? error.message : String(error));
    console.error("Full Error:", JSON.stringify(error, null, 2));
    console.error("Error Stack:", error instanceof Error ? error.stack : "No stack trace");
    console.error("========================================");
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Payment processing failed",
        error_details: {
          type: error?.constructor?.name,
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  }
});

