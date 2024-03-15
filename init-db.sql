-- Active: 1707156826205@@localhost@5434@postgres@public
CREATE DATABASE renthub;

-- fill category table to product location sportINSERT INTO category (name)
-- Catégories principales liées au matériel de location dans le sport
-- Catégories principales liées au matériel de location dans le sport
INSERT INTO category (name, "index", display, "createdBy", "createdAt")
VALUES
  ('Raquettes', 1, true, 'admin', NOW()),
  ('Ballons', 2, true, 'admin', NOW()),
  ('Équipement de protection', 3, true, 'admin', NOW()),
  ('Équipement de natation', 4, true, 'admin', NOW());

-- Sous-catégories pour les raquettes
INSERT INTO category (name, "index", display, "createdBy", "createdAt", "parentCategoryId")
VALUES
  ('Raquettes de tennis', 1, true, 'admin', NOW(), 1),
  ('Raquettes de badminton', 2, true, 'admin', NOW(), 1),
  ('Raquettes de squash', 3, true, 'admin', NOW(), 1);

-- Sous-catégories pour les ballons
INSERT INTO category (name, "index", display, "createdBy", "createdAt", "parentCategoryId")
VALUES
  ('Ballons de football', 1, true, 'admin', NOW(), 2),
  ('Ballons de basketball', 2, true, 'admin', NOW(), 2),
  ('Ballons de volleyball', 3, true, 'admin', NOW(), 2),
  ('Ballons de rugby', 4, true, 'admin', NOW(), 2);

-- Sous-catégories pour l'équipement de protection
INSERT INTO category (name, "index", display, "createdBy", "createdAt", "parentCategoryId")
VALUES
  ('Casques', 1, true, 'admin', NOW(), 3),
  ('Protections pour les genoux', 2, true, 'admin', NOW(), 3),
  ('Protections pour les coudes', 3, true, 'admin', NOW(), 3),
  ('Protections pour les poignets', 4, true, 'admin', NOW(), 3);

-- Sous-catégories pour l'équipement de natation
INSERT INTO category (name, "index", display, "createdBy", "createdAt", "parentCategoryId")
VALUES
  ('Maillots de bain', 1, true, 'admin', NOW(), 4),
  ('Lunettes de natation', 2, true, 'admin', NOW(), 4),
  ('Bonnet de bain', 3, true, 'admin', NOW(), 4),
  ('Planches de natation', 4, true, 'admin', NOW(), 4);


-- image to category fake data
INSERT INTO picture (filename, "createdBy", "updatedBy", "urlHD", "urlMiniature")
VALUES 
    ('surfboard.jpg', 'admin', NULL, 'http://example.com/images/surfboard_hd.jpg', 'http://example.com/images/surfboard_thumb.jpg'),
    ('ski.jpg', 'admin', NULL, 'http://example.com/images/ski_hd.jpg', 'http://example.com/images/ski_thumb.jpg'),
    ('bicycle.jpg', 'admin', NULL, 'http://example.com/images/bicycle_hd.jpg', 'http://example.com/images/bicycle_thumb.jpg'),
    ('hiking_boots.jpg', 'admin', NULL, 'http://example.com/images/hiking_boots_hd.jpg', 'http://example.com/images/hiking_boots_thumb.jpg');
