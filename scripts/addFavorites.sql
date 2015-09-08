INSERT INTO "Favorites"("createdAt", "updatedAt", "yelp_id", "UserId")
  SELECT clock_timestamp(), clock_timestamp(), 105, (SELECT id
                                                         FROM "Users"
                                                         WHERE email = 'klk@klk.com')
