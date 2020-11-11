Feature: JWT login feature
  Users should be able to access the Rest API with JWT

  Scenario Outline: Users should be able to get services with the rest api by logging in with JWT
    Given The user logs in with JWT <user> and <pass>
    Then The user should be able to get the services in the system
  Examples:
  |   user       |    pass    |
  |   Manager    |   Manager  |
  |   Customer   |   Customer |
  |   Stylist    |   Stylist  |
