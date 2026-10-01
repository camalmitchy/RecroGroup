-- Add grief camp flyer URL to site settings
INSERT INTO "site_settings" ("id", "key", "value", "updatedAt")
VALUES (
  'grief_camp_flyer_url',
  'grief_camp_flyer_url',
  '',
  NOW()
)
ON CONFLICT ("key") DO NOTHING;
