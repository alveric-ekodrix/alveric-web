// scripts/seed-about.js
// Idempotent seed script to populate all About Us content & statistics

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Read environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-service-role-key'
  ? process.env.SUPABASE_SERVICE_ROLE_KEY
  : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...vals] = trimmed.split('=');
    const val = vals.join('=').trim().replace(/^['"]|['"]$/g, '');
    if (key === 'NEXT_PUBLIC_SUPABASE_URL' && !supabaseUrl) supabaseUrl = val;
    if (key === 'SUPABASE_SERVICE_ROLE_KEY' && val !== 'your-service-role-key' && (!supabaseKey || supabaseKey.startsWith('sb_publishable_'))) {
      supabaseKey = val;
    }
    if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY' && !supabaseKey) supabaseKey = val;
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key not found in environment or .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DEFAULT_ABOUT_CONTENT = {
  heading: 'Building A Better Tomorrow',
  description:
    'Alveric Technical Contracting delivers reliable, innovative, and high-quality contracting solutions across commercial, residential, and industrial projects.',
  story:
    'Alveric Technical Contracting was founded with a clear vision — to deliver high-quality technical contracting services that create lasting value. Over the years, we have grown through our commitment to excellence, integrity, and innovation, becoming a trusted partner for clients across the UAE.',
  mission:
    'To deliver safe, reliable, and innovative contracting solutions that enhance communities and create long-term value for our clients, people, and partners.',
  vision:
    'To be a regional leader in technical contracting, recognized for quality, integrity, and a commitment to building a better tomorrow.',
  values:
    "Integrity: We do what's right, always. | Quality: We never compromise on standards. | Safety: People and safety come first. | Innovation: We embrace smarter solutions.",

  // 1. Hero Content
  hero_eyebrow: 'ABOUT ALVERIC',
  hero_feature_1_title: 'Quality Workmanship',
  hero_feature_2_title: 'On-Time Delivery',
  hero_feature_3_title: 'Client-Centric Approach',
  hero_primary_button: 'Our Services',
  hero_secondary_button: 'Get a Quote',
  hero_trust_text: 'Trusted by 100+ clients across the UAE',
  hero_overlay_label: 'ENGINEERING EXCELLENCE',
  hero_overlay_title: 'Engineering Excellence for a Brighter Future',

  // 3. Story Section
  story_eyebrow: 'OUR STORY',
  story_heading: 'A Journey Built on Trust and Expertise',
  story_button: 'Our Journey',
  story_image_overlay_title: 'Creating Smarter Spaces for Better Lives',

  // 4. Mission
  mission_eyebrow: 'OUR PURPOSE',
  mission_supporting_text: 'Focused on Progress. Driven by People.',

  // 5. Vision
  vision_eyebrow: 'OUR HORIZON',
  vision_supporting_text: 'Setting New Standards in Contracting Excellence.',

  // 6. Values
  values_items: [
    { title: 'Integrity', description: "We do what's right, always." },
    { title: 'Quality', description: 'We never compromise on standards.' },
    { title: 'Safety', description: 'People and safety come first.' },
    { title: 'Innovation', description: 'We embrace smarter solutions.' },
  ],
  values_link_text: 'Learn More About Our Values',

  // 7. Why Choose Alveric
  why_choose_eyebrow: 'WHY CHOOSE ALVERIC',
  why_choose_heading: 'More Than a Contractor A Long-Term Partner',
  why_choose_description:
    'We bring together technical expertise, industry experience, and a commitment to excellence to deliver solutions that stand the test of time.',
  why_choose_benefits: [
    'Licensed & Certified Professionals',
    'Comprehensive Project Management',
    'Transparent Communication',
    'Commitment to Quality & Safety',
  ],
  why_choose_button: 'Work With Us',
  why_choose_image_overlay: 'Trusted Partner in Every Build',

  // 8. Certifications
  certifications_eyebrow: 'OUR CERTIFICATIONS',
  certifications_heading: 'Committed to Global Standards',
  certifications_description:
    'We follow internationally recognized standards to ensure quality, safety, and compliance in every project we deliver.',
  certifications_items: [
    { title: 'ISO 9001:2015' },
    { title: 'UAE Municipality Compliant' },
    { title: 'HSE Certified' },
  ],

  // 9. Final CTA
  cta_eyebrow: "LET'S BUILD TOGETHER",
  cta_heading: 'Ready to Bring Your Project to Life?',
  cta_description:
    'Partner with Alveric Technical Contracting and experience reliable, efficient, and high-quality contracting solutions.',
  cta_primary_button: 'Get a Free Quote',
  cta_secondary_button: 'Chat on WhatsApp',
};

const DEFAULT_STATISTICS = [
  { value: '5+', label: 'Years of Excellence', display_order: 1 },
  { value: '100+', label: 'Projects Completed', display_order: 2 },
  { value: '50+', label: 'Happy Clients', display_order: 3 },
  { value: '25+', label: 'Skilled Professionals', display_order: 4 },
];

async function seedAbout() {
  console.log('--- Seeding About Us Content & Statistics ---');

  // 1. Seed / Upsert about_settings
  try {
    const { data: existingRows, error: fetchErr } = await supabase
      .from('about_settings')
      .select('*')
      .limit(1);

    if (fetchErr) {
      console.warn('Note on about_settings fetch:', fetchErr.message);
    }

    if (existingRows && existingRows.length > 0) {
      const existing = existingRows[0];
      console.log(`Found existing about_settings record (id: ${existing.id}). Updating missing fields...`);

      // Only update keys that are currently null or empty string, preserving user customizations
      const updatePayload = {};
      for (const [key, defaultVal] of Object.entries(DEFAULT_ABOUT_CONTENT)) {
        if (existing[key] === null || existing[key] === undefined || existing[key] === '') {
          updatePayload[key] = defaultVal;
        }
      }

      if (Object.keys(updatePayload).length > 0) {
        // Try updating with all extended columns
        const { error: updateErr } = await supabase
          .from('about_settings')
          .update(updatePayload)
          .eq('id', existing.id);

        if (updateErr) {
          console.warn('Update notice (if columns not yet migrated in database, run 005 migration in Supabase):', updateErr.message);
        } else {
          console.log(`Successfully updated ${Object.keys(updatePayload).length} fields in about_settings.`);
        }
      } else {
        console.log('about_settings already contains values for all fields.');
      }
    } else {
      console.log('No existing about_settings row found. Inserting default record...');
      const { error: insertErr } = await supabase
        .from('about_settings')
        .insert([DEFAULT_ABOUT_CONTENT]);

      if (insertErr) {
        console.warn('Insert notice (if columns not yet migrated in database, run 005 migration in Supabase):', insertErr.message);
      } else {
        console.log('Successfully created default about_settings record.');
      }
    }
  } catch (err) {
    console.warn('about_settings operation notice:', err.message || err);
  }

  // 2. Seed / Upsert 4 Statistics into site_statistics
  console.log('Seeding 4 Company Statistics into site_statistics (section = about)...');
  for (const stat of DEFAULT_STATISTICS) {
    try {
      const { data: existingStat } = await supabase
        .from('site_statistics')
        .select('id, value')
        .eq('section', 'about')
        .eq('label', stat.label)
        .maybeSingle();

      if (existingStat) {
        console.log(`Statistic "${stat.label}" exists. Value: "${existingStat.value}".`);
      } else {
        const { error: insertErr } = await supabase
          .from('site_statistics')
          .insert([
            {
              section: 'about',
              label: stat.label,
              value: stat.value,
              suffix: '',
              display_order: stat.display_order,
              is_published: true,
            },
          ]);

        if (insertErr) {
          console.warn(`Failed to insert statistic "${stat.label}":`, insertErr.message);
        } else {
          console.log(`Inserted statistic: "${stat.value} - ${stat.label}"`);
        }
      }
    } catch (statErr) {
      console.warn(`Error processing statistic "${stat.label}":`, statErr.message || statErr);
    }
  }

  console.log('--- About Us Seeding Completed Successfully ---');
}

seedAbout().catch((err) => {
  console.error('Fatal seeding error:', err);
  process.exit(1);
});
