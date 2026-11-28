-- ============================================================
-- Migration 002: Seed all 70+ products (prices to be confirmed by ChumaMart)
-- ============================================================

-- ============================================================
-- Categories
-- ============================================================
insert into categories (name, slug, sort_order, intro_text, filter_schema) values
('Cement',           'cement',          1,
 'Buy cement in Nakuru at the best prices. We stock all major brands: Bamburi, Simba, Blue Triangle, Rhino, Savannah and more. Free delivery within Nakuru town.',
 '{"Brand":["Bamburi","Simba","Blue Triangle","Rhino","Savannah","Rai","Premium"],"Grade":["32.5R","42.5N"]}'),

('Steel & Wire',     'steel-wire',      2,
 'Deformed bars (D-bars), round bars (R-bars), binding wire and hoop iron for all construction projects in Nakuru.',
 '{"Type":["Deformed (D)","Round (R)","Binding Wire","Hoop Iron"],"Diameter":["D8","D10","D12","D16","D20","D25","R6","R8","R10","R12","R16"]}'),

('Roofing',          'roofing',         3,
 'Iron sheets in Nakuru — box profile, corrugated, versatile and Roman tile, all gauges. Per-metre pricing. Free delivery in Nakuru town.',
 '{"Profile":["Box Profile","Corrugated","Versatile","Roman Tile","Ordinary"],"Grade":["Standard","Reject"],"Colour":["Zink/Plain","Green","Red","Blue"]}'),

('Water Tanks',      'water-tanks',     4,
 'Kentank water storage tanks from 1,000 L to 10,000 L. Durable, UV-resistant polyethylene. Free delivery within Nakuru town.',
 '{"Capacity":["1000L","2000L","3000L","5000L","10000L"]}'),

('Paints',           'paints',          5,
 'Crown Paints prices in Nakuru — vinyl matt, silk, exterior, roof, floor, primer, epoxy and more. All sizes in stock.',
 '{"Brand":["Crown"],"Type":["Vinyl Matt","Vinyl Silk","Covermat","Gloss","Exterior","Roof","Floor","Primer","Dampseal","Road Marking","Epoxy","Varnish"],"Size":["1L","4L","20L"]}'),

('Gypsum & Ceiling', 'gypsum-ceiling',  6,
 'Gypsum ceiling boards, channels, studs, runners and wall angles for interior finishing in Nakuru.',
 '{"Thickness":["9mm","9.5mm","12mm","12.5mm"],"Type":["Standard","Moisture Resistant","Channel","Stud","Runner","Wall Angle"]}'),

('Plumbing & Pipes', 'plumbing-pipes',  7,
 'PVC Schedule-40 pipes, galvanised sleeves and PVC band plates for plumbing in Nakuru.',
 '{"Material":["PVC","Galvanised"],"Diameter":["2 inch","3 inch","4 inch"]}'),

('Fencing',          'fencing',         8,
 'Chain link fencing rolls in Nakuru — 14 gauge, 18 m rolls, 4 ft to 8 ft heights.',
 '{"Height":["4ft","5ft","6ft","7ft","8ft"]}'),

('Tools & Hardware', 'tools-hardware',  9,
 'Tools, nails, hinges and hardware for builders in Nakuru. Stock being added — contact us for specific items.',
 '{"Type":["Nails","Hinges","Tools","Fasteners"]}')
on conflict (slug) do nothing;


-- ============================================================
-- CEMENT (per 50 kg bag)
-- ============================================================
insert into products (name, slug, category_id, brand, size_grade, unit, featured, stock_status)
select v.name, v.slug, c.id, v.brand, v.size_grade, v.unit, v.featured, v.stock_status from (values
  ('Premium Cement',         'premium-cement',         'cement', 'Premium',       '32.5R', 'per 50 kg bag', true,  'in_stock'),
  ('Simba Cement 32.5R',     'simba-cement-32-5r',     'cement', 'Simba',         '32.5R', 'per 50 kg bag', true,  'in_stock'),
  ('Simba Cement 42.5N',     'simba-cement-42-5n',     'cement', 'Simba',         '42.5N', 'per 50 kg bag', false, 'in_stock'),
  ('Blue Triangle Cement',   'blue-triangle-cement',   'cement', 'Blue Triangle', '42.5N', 'per 50 kg bag', true,  'in_stock'),
  ('Bamburi Cement',         'bamburi-cement',         'cement', 'Bamburi',       '42.5N', 'per 50 kg bag', true,  'in_stock'),
  ('Rhino Cement',           'rhino-cement',           'cement', 'Rhino',         '42.5N', 'per 50 kg bag', false, 'in_stock'),
  ('Savannah Cement',        'savannah-cement',        'cement', 'Savannah',      '42.5N', 'per 50 kg bag', false, 'in_stock'),
  ('Rai Cement',             'rai-cement',             'cement', 'Rai',           '32.5R', 'per 50 kg bag', false, 'in_stock')
) as v(name, slug, cat_slug, brand, size_grade, unit, featured, stock_status)
join categories c on c.slug = v.cat_slug
on conflict (slug) do nothing;

-- ============================================================
-- STEEL & WIRE (per bar 12 m or per roll)
-- ============================================================
insert into products (name, slug, category_id, brand, size_grade, unit, featured, stock_status)
select v.name, v.slug, c.id, v.brand, v.size_grade, v.unit, v.featured, v.stock_status from (values
  ('Deformed Bar D8',   'deformed-bar-d8',   'steel-wire', null, 'D8',  'per 12 m bar', false, 'in_stock'),
  ('Deformed Bar D10',  'deformed-bar-d10',  'steel-wire', null, 'D10', 'per 12 m bar', false, 'in_stock'),
  ('Deformed Bar D12',  'deformed-bar-d12',  'steel-wire', null, 'D12', 'per 12 m bar', true,  'in_stock'),
  ('Deformed Bar D16',  'deformed-bar-d16',  'steel-wire', null, 'D16', 'per 12 m bar', true,  'in_stock'),
  ('Deformed Bar D20',  'deformed-bar-d20',  'steel-wire', null, 'D20', 'per 12 m bar', false, 'in_stock'),
  ('Deformed Bar D25',  'deformed-bar-d25',  'steel-wire', null, 'D25', 'per 12 m bar', false, 'in_stock'),
  ('Round Bar R6',      'round-bar-r6',      'steel-wire', null, 'R6',  'per 12 m bar', false, 'in_stock'),
  ('Round Bar R8',      'round-bar-r8',      'steel-wire', null, 'R8',  'per 12 m bar', false, 'in_stock'),
  ('Round Bar R10',     'round-bar-r10',     'steel-wire', null, 'R10', 'per 12 m bar', false, 'in_stock'),
  ('Round Bar R12',     'round-bar-r12',     'steel-wire', null, 'R12', 'per 12 m bar', false, 'in_stock'),
  ('Round Bar R16',     'round-bar-r16',     'steel-wire', null, 'R16', 'per 12 m bar', false, 'in_stock'),
  ('Binding Wire',      'binding-wire',      'steel-wire', null, '25 kg roll', 'per roll (25 kg)', false, 'in_stock'),
  ('Hoop Iron',         'hoop-iron',         'steel-wire', null, '30 m roll',  'per roll (30 m)',  false, 'in_stock')
) as v(name, slug, cat_slug, brand, size_grade, unit, featured, stock_status)
join categories c on c.slug = v.cat_slug
on conflict (slug) do nothing;

-- ============================================================
-- ROOFING (per metre, state gauge)
-- ============================================================
insert into products (name, slug, category_id, brand, size_grade, unit, featured, stock_status)
select v.name, v.slug, c.id, v.brand, v.size_grade, v.unit, v.featured, v.stock_status from (values
  ('Box Profile Iron Sheet',    'box-profile-iron-sheet',    'roofing', null, '0.3 mm gauge', 'per metre', true,  'in_stock'),
  ('Ordinary Iron Sheet',       'ordinary-iron-sheet',       'roofing', null, '0.25 mm gauge','per metre', false, 'in_stock'),
  ('Corrugated Iron Sheet',     'corrugated-iron-sheet',     'roofing', null, '0.25 mm gauge','per metre', true,  'in_stock'),
  ('Versatile Iron Sheet',      'versatile-iron-sheet',      'roofing', null, '0.4 mm gauge', 'per metre', false, 'in_stock'),
  ('Roman Tile Iron Sheet',     'roman-tile-iron-sheet',     'roofing', null, '0.4 mm gauge', 'per metre', false, 'in_stock'),
  ('Reject Iron Sheet (Grade A)','reject-iron-sheet-a',      'roofing', null, 'Reject Grade A','per metre', false, 'in_stock'),
  ('Reject Iron Sheet (Grade B)','reject-iron-sheet-b',      'roofing', null, 'Reject Grade B','per metre', false, 'in_stock')
) as v(name, slug, cat_slug, brand, size_grade, unit, featured, stock_status)
join categories c on c.slug = v.cat_slug
on conflict (slug) do nothing;

-- ============================================================
-- WATER TANKS (Kentank, per tank)
-- ============================================================
insert into products (name, slug, category_id, brand, size_grade, unit, featured, stock_status)
select v.name, v.slug, c.id, v.brand, v.size_grade, v.unit, v.featured, v.stock_status from (values
  ('Kentank 1,000 L',   'kentank-1000l',  'water-tanks', 'Kentank', '1,000 L',  'per tank', false, 'in_stock'),
  ('Kentank 2,000 L',   'kentank-2000l',  'water-tanks', 'Kentank', '2,000 L',  'per tank', true,  'in_stock'),
  ('Kentank 3,000 L',   'kentank-3000l',  'water-tanks', 'Kentank', '3,000 L',  'per tank', true,  'in_stock'),
  ('Kentank 5,000 L',   'kentank-5000l',  'water-tanks', 'Kentank', '5,000 L',  'per tank', true,  'in_stock'),
  ('Kentank 10,000 L',  'kentank-10000l', 'water-tanks', 'Kentank', '10,000 L', 'per tank', false, 'in_stock')
) as v(name, slug, cat_slug, brand, size_grade, unit, featured, stock_status)
join categories c on c.slug = v.cat_slug
on conflict (slug) do nothing;

-- ============================================================
-- PAINTS (Crown, per tin — prices to be confirmed)
-- ============================================================
insert into products (name, slug, category_id, brand, size_grade, unit, stock_status)
select v.name, v.slug, c.id, v.brand, v.size_grade, v.unit, v.stock_status from (values
  ('Crown Vinyl Matt 1L',      'crown-vinyl-matt-1l',      'paints', 'Crown', 'Vinyl Matt 1L',      'per 1 L tin',  'in_stock'),
  ('Crown Vinyl Matt 4L',      'crown-vinyl-matt-4l',      'paints', 'Crown', 'Vinyl Matt 4L',      'per 4 L tin',  'in_stock'),
  ('Crown Vinyl Matt 20L',     'crown-vinyl-matt-20l',     'paints', 'Crown', 'Vinyl Matt 20L',     'per 20 L tin', 'in_stock'),
  ('Crown Vinyl Silk 1L',      'crown-vinyl-silk-1l',      'paints', 'Crown', 'Vinyl Silk 1L',      'per 1 L tin',  'in_stock'),
  ('Crown Vinyl Silk 4L',      'crown-vinyl-silk-4l',      'paints', 'Crown', 'Vinyl Silk 4L',      'per 4 L tin',  'in_stock'),
  ('Crown Vinyl Silk 20L',     'crown-vinyl-silk-20l',     'paints', 'Crown', 'Vinyl Silk 20L',     'per 20 L tin', 'in_stock'),
  ('Crown Covermat 4L',        'crown-covermat-4l',        'paints', 'Crown', 'Covermat 4L',        'per 4 L tin',  'in_stock'),
  ('Crown Covermat 20L',       'crown-covermat-20l',       'paints', 'Crown', 'Covermat 20L',       'per 20 L tin', 'in_stock'),
  ('Crown Gloss 1L',           'crown-gloss-1l',           'paints', 'Crown', 'Gloss 1L',           'per 1 L tin',  'in_stock'),
  ('Crown Gloss 4L',           'crown-gloss-4l',           'paints', 'Crown', 'Gloss 4L',           'per 4 L tin',  'in_stock'),
  ('Crown Exterior 4L',        'crown-exterior-4l',        'paints', 'Crown', 'Exterior 4L',        'per 4 L tin',  'in_stock'),
  ('Crown Exterior 20L',       'crown-exterior-20l',       'paints', 'Crown', 'Exterior 20L',       'per 20 L tin', 'in_stock'),
  ('Crown Roof Paint 4L',      'crown-roof-paint-4l',      'paints', 'Crown', 'Roof Paint 4L',      'per 4 L tin',  'in_stock'),
  ('Crown Roof Paint 20L',     'crown-roof-paint-20l',     'paints', 'Crown', 'Roof Paint 20L',     'per 20 L tin', 'in_stock'),
  ('Crown Floor Paint 4L',     'crown-floor-paint-4l',     'paints', 'Crown', 'Floor Paint 4L',     'per 4 L tin',  'in_stock'),
  ('Crown Primer 4L',          'crown-primer-4l',          'paints', 'Crown', 'Primer 4L',          'per 4 L tin',  'in_stock'),
  ('Crown Primer 20L',         'crown-primer-20l',         'paints', 'Crown', 'Primer 20L',         'per 20 L tin', 'in_stock'),
  ('Crown Dampseal 4L',        'crown-dampseal-4l',        'paints', 'Crown', 'Dampseal 4L',        'per 4 L tin',  'in_stock'),
  ('Crown Epoxy 4L',           'crown-epoxy-4l',           'paints', 'Crown', 'Epoxy 4L',           'per 4 L tin',  'in_stock'),
  ('Crown Varnish 1L',         'crown-varnish-1l',         'paints', 'Crown', 'Varnish 1L',         'per 1 L tin',  'in_stock')
) as v(name, slug, cat_slug, brand, size_grade, unit, stock_status)
join categories c on c.slug = v.cat_slug
on conflict (slug) do nothing;

-- ============================================================
-- GYPSUM & CEILING
-- ============================================================
insert into products (name, slug, category_id, brand, size_grade, unit, stock_status)
select v.name, v.slug, c.id, v.brand, v.size_grade, v.unit, v.stock_status from (values
  ('Gypsum Board 9mm',         'gypsum-board-9mm',         'gypsum-ceiling', null, '9 mm',    'per board (1.2×2.4 m)',  'in_stock'),
  ('Gypsum Board 9.5mm',       'gypsum-board-9-5mm',       'gypsum-ceiling', null, '9.5 mm',  'per board (1.2×2.4 m)',  'in_stock'),
  ('Gypsum Board 12mm',        'gypsum-board-12mm',        'gypsum-ceiling', null, '12 mm',   'per board (1.2×2.4 m)',  'in_stock'),
  ('Gypsum Board 12.5mm',      'gypsum-board-12-5mm',      'gypsum-ceiling', null, '12.5 mm', 'per board (1.2×2.4 m)',  'in_stock'),
  ('Moisture-Resistant Board 12.5mm','mr-gypsum-board-12-5mm','gypsum-ceiling',null,'12.5 mm MR','per board (1.2×2.4 m)','in_stock'),
  ('Ceiling Channel (C)',      'ceiling-channel',           'gypsum-ceiling', null, '0.5 mm',  'per 3 m length',         'in_stock'),
  ('Wall Stud',                'wall-stud',                 'gypsum-ceiling', null, '0.5 mm',  'per 3 m length',         'in_stock'),
  ('Top/Bottom Runner',        'ceiling-runner',            'gypsum-ceiling', null, '0.5 mm',  'per 3 m length',         'in_stock'),
  ('Wall Angle (L-trim)',      'wall-angle',                'gypsum-ceiling', null, '0.3 mm',  'per 3 m length',         'in_stock')
) as v(name, slug, cat_slug, brand, size_grade, unit, stock_status)
join categories c on c.slug = v.cat_slug
on conflict (slug) do nothing;

-- ============================================================
-- PLUMBING & PIPES
-- ============================================================
insert into products (name, slug, category_id, brand, size_grade, unit, stock_status)
select v.name, v.slug, c.id, v.brand, v.size_grade, v.unit, v.stock_status from (values
  ('PVC Pipe Sch-40 2"',       'pvc-pipe-sch40-2inch',      'plumbing-pipes', null, '2" Sch-40', 'per 6 m length', 'in_stock'),
  ('PVC Pipe Sch-40 3"',       'pvc-pipe-sch40-3inch',      'plumbing-pipes', null, '3" Sch-40', 'per 6 m length', 'in_stock'),
  ('Galvanised Sleeve 2"',     'galv-sleeve-2inch',         'plumbing-pipes', null, '2" GI',     'per piece',      'in_stock'),
  ('Galvanised Sleeve 3"',     'galv-sleeve-3inch',         'plumbing-pipes', null, '3" GI',     'per piece',      'in_stock'),
  ('Galvanised Sleeve 4"',     'galv-sleeve-4inch',         'plumbing-pipes', null, '4" GI',     'per piece',      'in_stock'),
  ('PVC Band Plate 2"',        'pvc-band-plate-2inch',      'plumbing-pipes', null, '2"',        'per piece',      'in_stock'),
  ('PVC Band Plate 3"',        'pvc-band-plate-3inch',      'plumbing-pipes', null, '3"',        'per piece',      'in_stock')
) as v(name, slug, cat_slug, brand, size_grade, unit, stock_status)
join categories c on c.slug = v.cat_slug
on conflict (slug) do nothing;

-- ============================================================
-- FENCING (chain link, 18 m roll)
-- ============================================================
insert into products (name, slug, category_id, brand, size_grade, unit, featured, stock_status)
select v.name, v.slug, c.id, v.brand, v.size_grade, v.unit, v.featured, v.stock_status from (values
  ('Chain Link Fencing 4ft',  'chain-link-4ft',  'fencing', null, '4ft × 18m 14G', 'per 18 m roll', true,  'in_stock'),
  ('Chain Link Fencing 5ft',  'chain-link-5ft',  'fencing', null, '5ft × 18m 14G', 'per 18 m roll', false, 'in_stock'),
  ('Chain Link Fencing 6ft',  'chain-link-6ft',  'fencing', null, '6ft × 18m 14G', 'per 18 m roll', true,  'in_stock'),
  ('Chain Link Fencing 7ft',  'chain-link-7ft',  'fencing', null, '7ft × 18m 14G', 'per 18 m roll', false, 'in_stock'),
  ('Chain Link Fencing 8ft',  'chain-link-8ft',  'fencing', null, '8ft × 18m 14G', 'per 18 m roll', false, 'in_stock')
) as v(name, slug, cat_slug, brand, size_grade, unit, featured, stock_status)
join categories c on c.slug = v.cat_slug
on conflict (slug) do nothing;


-- ============================================================
-- PRICES (seed from current site — MUST BE CONFIRMED by ChumaMart)
-- Paints, Gypsum, Plumbing prices marked 0 pending OQ-4
-- ============================================================
insert into prices (product_id, unit_price)
select p.id, v.price from (values
  -- Cement
  ('premium-cement',         550),
  ('simba-cement-32-5r',     600),
  ('simba-cement-42-5n',     700),
  ('blue-triangle-cement',   630),
  ('bamburi-cement',         600),
  ('rhino-cement',           650),
  ('savannah-cement',        650),
  ('rai-cement',             600),
  -- Steel D-bars
  ('deformed-bar-d8',         450),
  ('deformed-bar-d10',        700),
  ('deformed-bar-d12',        950),
  ('deformed-bar-d16',       1600),
  ('deformed-bar-d20',       2500),
  ('deformed-bar-d25',       3900),
  -- Steel R-bars
  ('round-bar-r6',            210),
  ('round-bar-r8',            450),
  ('round-bar-r10',           700),
  ('round-bar-r12',           950),
  ('round-bar-r16',          1800),
  -- Wire
  ('binding-wire',           2780),
  ('hoop-iron',              3000),
  -- Roofing
  ('box-profile-iron-sheet',  400),
  ('ordinary-iron-sheet',     300),
  ('corrugated-iron-sheet',   350),
  ('versatile-iron-sheet',    600),
  ('roman-tile-iron-sheet',   500),
  ('reject-iron-sheet-a',     200),
  ('reject-iron-sheet-b',     150),
  -- Water Tanks
  ('kentank-1000l',          4500),
  ('kentank-2000l',          8500),
  ('kentank-3000l',         12000),
  ('kentank-5000l',         22500),
  ('kentank-10000l',        45500),
  -- Fencing
  ('chain-link-4ft',         1800),
  ('chain-link-5ft',         2200),
  ('chain-link-6ft',         2800),
  ('chain-link-7ft',         3200),
  ('chain-link-8ft',         3500),
  -- Paints (OQ-4 — to be confirmed; placeholder 0)
  ('crown-vinyl-matt-1l',       0),
  ('crown-vinyl-matt-4l',       0),
  ('crown-vinyl-matt-20l',      0),
  ('crown-vinyl-silk-1l',       0),
  ('crown-vinyl-silk-4l',       0),
  ('crown-vinyl-silk-20l',      0),
  ('crown-covermat-4l',         0),
  ('crown-covermat-20l',        0),
  ('crown-gloss-1l',            0),
  ('crown-gloss-4l',            0),
  ('crown-exterior-4l',         0),
  ('crown-exterior-20l',        0),
  ('crown-roof-paint-4l',       0),
  ('crown-roof-paint-20l',      0),
  ('crown-floor-paint-4l',      0),
  ('crown-primer-4l',           0),
  ('crown-primer-20l',          0),
  ('crown-dampseal-4l',         0),
  ('crown-epoxy-4l',            0),
  ('crown-varnish-1l',          0),
  -- Gypsum (OQ-4 — to be confirmed; placeholder 0)
  ('gypsum-board-9mm',          0),
  ('gypsum-board-9-5mm',        0),
  ('gypsum-board-12mm',         0),
  ('gypsum-board-12-5mm',       0),
  ('mr-gypsum-board-12-5mm',    0),
  ('ceiling-channel',           0),
  ('wall-stud',                 0),
  ('ceiling-runner',            0),
  ('wall-angle',                0),
  -- Plumbing (OQ-4 — to be confirmed; placeholder 0)
  ('pvc-pipe-sch40-2inch',      0),
  ('pvc-pipe-sch40-3inch',      0),
  ('galv-sleeve-2inch',         0),
  ('galv-sleeve-3inch',         0),
  ('galv-sleeve-4inch',         0),
  ('pvc-band-plate-2inch',      0),
  ('pvc-band-plate-3inch',      0)
) as v(slug, price)
join products p on p.slug = v.slug
on conflict (product_id) do update set unit_price = excluded.unit_price, updated_at = now();

-- Cement bulk tiers
update prices set tiers = '[{"min_qty":50,"price":530},{"min_qty":200,"price":510}]'
where product_id in (select id from products where category_id = (select id from categories where slug='cement'));
