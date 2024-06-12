-- Active: 1710102669817@@127.0.0.1@5434@renthub
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
INSERT INTO picture ("name", "mimetype", "path", "urlHD", "urlMiniature", "createdBy", "updatedBy", "createdAt", "updatedAt")
VALUES 
    ('surfboard.jpg', 'image/jpeg', '/images/surfboard.jpg', 'http://example.com/images/surfboard_hd.jpg', 'http://example.com/images/surfboard_thumb.jpg', 1, NULL, now(), NULL),
    ('ski.jpg', 'image/jpeg', '/images/ski.jpg', 'http://example.com/images/ski_hd.jpg', 'http://example.com/images/ski_thumb.jpg', 1, NULL, now(), NULL),
    ('bicycle.jpg', 'image/jpeg', '/images/bicycle.jpg', 'http://example.com/images/bicycle_hd.jpg', 'http://example.com/images/bicycle_thumb.jpg', 1, NULL, now(), NULL),
    ('hiking_boots.jpg', 'image/jpeg', '/images/hiking_boots.jpg', 'http://example.com/images/hiking_boots_hd.jpg', 'http://example.com/images/hiking_boots_thumb.jpg', 1, NULL, now(), NULL);





