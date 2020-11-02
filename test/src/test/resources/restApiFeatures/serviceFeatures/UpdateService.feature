Feature: Update Service feature
  Only Managers should be able to update services

  Scenario Outline: Manager should be able to udpate services with the rest api
    Given The user logs in as manager <user> and <pass>
    And the service <upKey> exists
    When Manager updates the service <upKey> with the new service <data>
    Then the service <upKey> should be updated to <data> in the database
  Examples:
  |   user       |    pass    | upKey  |                                     data                                             |
  |   Manager    |   Manager  |   1    |  {"serviceName": "Blower", "defaultDuration": 15, "description": "Secado de pelo"}   |

  Scenario Outline: Customer should not be able to update services with the rest api
    Given The user logs in as customer <user> and <pass>
    And the service <upKey> exists
    Then Updating the service <upKey> with the new service <data> should fail
  Examples:
  |   user        |    pass     | upKey  |                                     data                                             |
  |   Customer    |   Customer  |   1    |  {"serviceName": "Plancha", "defaultDuration": 15, "description": "Pelo liso"}   |

  Scenario Outline: Stylist should not be able to add services with the rest api
    Given The user logs in as stylist <user> and <pass>
    And the service <upKey> exists
    Then Updating the service <upKey> with the new service <data> should fail
  Examples:
  |   user       |    pass    | upKey  |                                     data                                             |
  |   Stylist    |   Stylist  |   1    |  {"serviceName": "Plancha", "defaultDuration": 15, "description": "Pelo liso"}   |
