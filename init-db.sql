-- Active: 1710102669817@@127.0.0.1@5434@renthub

--CREATE DATABASE renthub;

-- fill category table to product location sportINSERT INTO category (name)
-- Catégories principales liées au matériel de location dans le sport
-- Catégories principales liées au matériel de location dans le sport
INSERT INTO
    category (
        name, "index", display, "createdBy", "createdAt"
    )
VALUES (
        'Raquettes', 1, true, 1, NOW()
    ),
    ('Ballons', 2, true, 1, NOW()),
    (
        'Équipement de protection', 3, true, 1, NOW()
    ),
    (
        'Équipement de natation', 4, true, 1, NOW()
    );

-- Sous-catégories pour les raquettes

INSERT INTO
    category (
        name, "index", display, "createdBy", "createdAt", "parentCategoryId"
    )
VALUES (
        'Raquettes de tennis', 1, true, 1, NOW(), 1
    ),
    (
        'Raquettes de badminton', 2, true, 1, NOW(), 1
    ),
    (
        'Raquettes de squash', 3, true, 1, NOW(), 1
    );
-- Sous-catégories pour les ballons
INSERT INTO
    category (
        name, "index", display, "createdBy", "createdAt", "parentCategoryId"
    )
VALUES (
        'Ballons de football', 1, true, 1, NOW(), 2
    ),
    (
        'Ballons de basketball', 2, true, 1, NOW(), 2
    ),
    (
        'Ballons de volleyball', 3, true, 1, NOW(), 2
    ),
    (
        'Ballons de rugby', 4, true, 1, NOW(), 2
    );

-- Sous-catégories pour l'équipement de protection
INSERT INTO
    category (
        name, "index", display, "createdBy", "createdAt", "parentCategoryId"
    )
VALUES (
        'Casques', 1, true, 1, NOW(), 3
    ),
    (
        'Protections pour les genoux', 2, true, 1, NOW(), 3
    ),
    (
        'Protections pour les coudes', 3, true, 1, NOW(), 3
    ),
    (
        'Protections pour les poignets', 4, true, 1, NOW(), 3
    );

-- Sous-catégories pour l'équipement de natation
INSERT INTO
    category (
        name, "index", display, "createdBy", "createdAt", "parentCategoryId"
    )
VALUES (
        'Maillots de bain', 1, true, 1, NOW(), 4
    ),
    (
        'Lunettes de natation', 2, true, 1, NOW(), 4
    ),
    (
        'Bonnet de bain', 3, true, 1, NOW(), 4
    ),
    (
        'Planches de natation', 4, true, 1, NOW(), 4
    );

-- image to category fake data
INSERT INTO
    picture (
        filename, "createdBy", "updatedBy", "urlHD", "urlMiniature"
    )
VALUES (
        'surfboard.jpg', 1, 1, 'http://example.com/images/surfboard_hd.jpg', 'http://example.com/images/surfboard_thumb.jpg'
    ),
    (
        'ski.jpg', 1, 1, 'http://example.com/images/ski_hd.jpg', 'http://example.com/images/ski_thumb.jpg'
    ),
    (
        'bicycle.jpg', 1, 1, 'http://example.com/images/bicycle_hd.jpg', 'http://example.com/images/bicycle_thumb.jpg'
    ),
    (
        'hiking_boots.jpg', 1, 1, 'http://example.com/images/hiking_boots_hd.jpg', 'http://example.com/images/hiking_boots_thumb.jpg'
    );

INSERT INTO
    "role" (
        "updatedAt", "name", "right" "createdAt"
    )
VALUES (
        '2024-03-12 22:37:14', 'admin', 'amin', '2024-03-12 22:37:26'
    );

--    admin "email": "contact@renthub.com","password":"@Le123456789"
INSERT INTO
    "user" (
        "firstName", "lastName", "nickName", "dateOfBirth", "hashedPassword", "phoneNumber", "email", "isVerified", "lastConnectionDate", "createdById", "updatedById", "pictureId", "role"
    )
VALUES (
        'contact', 'contact ', 'johndoe', '1990-05-15', '$argon2id$v=19$m=65536,t=3,p=4$KncRK/yyBlFTqgH5O7oESQ$qYByI/1rT6EelriDiACclaereHeA3duuXJpJZR76VG0', '1234567890', 'contact@renthub.com', true, null, 1, 1, 1, 1
    );