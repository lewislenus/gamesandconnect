// Test script to show the new event URLs
function generateEventSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Sample event titles from your database
const eventTitles = [
  "Akosombo Games Day - Action Packed Day Trip",
  "FIFA Tournament & Gaming Night",
  "Cape Coast Weekend Adventure",
  "Trivia Friday Night",
  "Beach Cleanup & Community Service",
  "Monthly Gaming Tournament"
];

console.log("🔗 New Event URLs (using event name slugs):");
console.log("=" * 50);

eventTitles.forEach(title => {
  const slug = generateEventSlug(title);
  const oldUrl = `/events/some-random-id`;
  const newUrl = `/events/${slug}`;
  
  console.log(`📅 Event: ${title}`);
  console.log(`   Old URL: ${oldUrl}`);
  console.log(`   New URL: ${newUrl}`);
  console.log("");
});

console.log("✅ Benefits of the new URL structure:");
console.log("• SEO-friendly URLs that include event names");
console.log("• More descriptive and memorable links");
console.log("• Better social media sharing experience");
console.log("• Easier to understand what the link leads to");
