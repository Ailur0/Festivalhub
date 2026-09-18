-- The starter vendor catalogue every group can browse.
-- This lives in a migration (not seed.sql) so hosted projects get it from `supabase db push`.
-- Vendor names are unique so re-running this changes nothing.

alter table public.vendors add constraint vendors_name_key unique (name);

insert into public.vendors (name, category, description, rating, review_count, location, phone, email, price_min, price_max,
                            verified, recommended_by_group, recommended_by_admin, recommended_on)
values
  ('Golden Catering Services', 'Catering',
   'Premium catering for traditional festival food and sweets. Authentic vegetarian menus for Diwali, Holi and Ganesh Chaturthi, cooked from family recipes with fresh ingredients.',
   4.8, 127, 'Mumbai, Maharashtra', '+91 98765 43210', 'info@goldencatering.com', 500, 2000, true, 'Diwali Mumbai 2026', 'Rajesh Kumar', '2026-08-15'),
  ('Elegant Decorations', 'Decoration',
   'Decoration for festivals and celebrations: mandap setups, floral arrangements and traditional lighting that honour cultural traditions.',
   4.9, 89, 'Delhi, NCR', '+91 98765 43211', 'contact@elegantdecorations.com', 800, 5000, true, 'Delhi Holi Festival', 'Meera Patel', '2026-08-12'),
  ('SoundWave Audio Systems', 'Sound & Lighting',
   'Sound and lighting rental for festivals: audio systems, microphones and stage lighting, with technicians on site.',
   4.6, 156, 'Bangalore, Karnataka', '+91 98765 43212', 'bookings@soundwaveaudio.com', 300, 1500, false, null, null, null),
  ('Divine Photography', 'Photography',
   'Photographers who understand the rituals and capture festival moments with an artistic, traditional style.',
   4.7, 203, 'Chennai, Tamil Nadu', '+91 98765 43213', 'info@divinephotography.com', 1000, 3000, true, null, null, null),
  ('Festival Transport Services', 'Transportation',
   'Buses and vans for attendees and equipment, with experience in festival logistics and crowd flow.',
   4.4, 78, 'Pune, Maharashtra', '+91 98765 43214', 'bookings@festivaltransport.com', 200, 800, false, null, null, null),
  ('Sacred Supplies Store', 'Supplies',
   'Pooja items, decorative materials and traditional accessories from trusted makers.',
   4.5, 92, 'Kolkata, West Bengal', '+91 98765 43215', 'orders@sacredsupplies.com', 100, 1000, true, 'Kolkata Durga Puja Committee', 'Amit Banerjee', '2026-08-10'),
  ('Secure Events Protection', 'Security',
   'Trained security staff for large gatherings, experienced in crowd management and event safety.',
   4.3, 45, 'Hyderabad, Telangana', '+91 98765 43216', 'security@secureevents.com', 400, 1200, true, null, null, null),
  ('Clean Sweep Services', 'Cleaning',
   'Post-event cleaning for venues and community spaces using eco-friendly products.',
   4.2, 67, 'Jaipur, Rajasthan', '+91 98765 43217', 'bookings@cleansweep.com', 150, 600, false, null, null, null)
on conflict (name) do nothing;

insert into public.vendor_reviews (vendor_id, author_name, rating, comment, reviewed_on)
select v.id, r.author_name, r.rating, r.comment, r.reviewed_on::date
from (values
  ('Elegant Decorations', 'Priya Sharma', 5, 'Stunning decoration for our Diwali celebration. The team understood exactly what we wanted.', '2025-11-02'),
  ('Golden Catering Services', 'Rajesh Kumar', 4, 'Delicious food and great presentation. Setup ran a little late, but we were very happy overall.', '2025-10-28'),
  ('Divine Photography', 'Meera Patel', 5, 'Beautiful photos of our Ganesh Chaturthi aarti. Creative and professional.', '2025-09-20')
) as r (vendor_name, author_name, rating, comment, reviewed_on)
join public.vendors v on v.name = r.vendor_name
where not exists (
  select 1 from public.vendor_reviews existing
  where existing.vendor_id = v.id and existing.author_name = r.author_name
);
