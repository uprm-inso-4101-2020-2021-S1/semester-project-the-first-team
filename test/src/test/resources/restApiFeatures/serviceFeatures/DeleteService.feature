Feature: Delete Service feature
  Only Managers should be able to remove services

  Scenario Outline: Manager should be able to delete services with the rest api
    Given The user logs in as manager <user> and <pass>
    And the service <servKey> exists
    When Manager deletes the service <servKey>
    Then the service <servKey> should not be in the database
  Examples:
  |   user       |    pass    |   servKey   |
  |   Manager    |   Manager  |      2      |

  Scenario Outline: Customer should not be able to remove services with the rest api
    Given The user logs in as customer <user> and <pass>
    And the service <servKey> exists
    Then Removing the service <servKey> should fail
  Examples:
  |   user       |    pass    |   servKey   |
  |   Customer   |   Customer |      1      |

  Scenario Outline: Stylist should not be able to remove services with the rest api
    Given The user logs in as stylist <user> and <pass>
    And the service <servKey> exists
    Then Removing the service <servKey> should fail
  Examples:
  |   user       |    pass    |   servKey   |
  |   Stylist    |   Stylist  |      1      |
