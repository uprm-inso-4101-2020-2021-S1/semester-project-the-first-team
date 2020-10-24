Feature: Add Stylist feature
  Only Managers should be able to add stylists

  Scenario Outline: Manager should be able to add stylist with the rest api
    Given Rest API is up and running and the user logs in as manager <user> and <pass>
    When Manager adds stylist credentials as <data>
    Then the stylist <data> should be created and added to the database
  Examples:
  |   user       |    pass    |                                                           data                                                                  |
  |   Manager    |   Manager  |   {"username": "Test", "first_name": "Test", "last_name": "test", "email": "admin@test.com", "role": "1", "password": "test"}   |

  Scenario Outline: Customer should not be able to add stylist with the rest api
    Given Rest API is up and running and the user logs in as customer <user> and <pass>
    Then Adding the new stylist <data> should fail
  Examples:
  |   user       |    pass    |                                                             data                                                                    |
  |   Customer   |   Customer |   {"username": "Test2", "first_name": "Test", "last_name": "test", "email": "stylist2@test.com", "role": "1", "password": "test"}   |

  Scenario Outline: Stylist should not be able to add stylist with the rest api
    Given Rest API is up and running and the user logs in as stylist <user> and <pass>
    Then Adding the new stylist <data> should fail
  Examples:
  |   user       |    pass    |                                                             data                                                                    |
  |   Stylist    |   Stylist  |   {"username": "Test3", "first_name": "Test", "last_name": "test", "email": "stylist3@test.com", "role": "1", "password": "test"}   |
