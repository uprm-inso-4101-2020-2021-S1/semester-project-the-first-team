Feature: Add Stylist feature

  Scenario Outline: Manager should be able to add stylist with the rest api
  	Given Rest API is up and running and the user logs in as <user> and <pass>
    When Manager adds stylist credentials as <data>
    Then the stylist <data> should be created and added to the database
Examples:
|   user       |    pass    |                                                           data                                                                  |
|   Manager    |   Manager  |   {"username": "Test", "first_name": "Test", "last_name": "test", "email": "admin@test.com", "role": "1", "password": "test"}   |