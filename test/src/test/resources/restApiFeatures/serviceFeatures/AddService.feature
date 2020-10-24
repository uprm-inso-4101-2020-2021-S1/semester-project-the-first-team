Feature: Add Service feature
  Only Managers should be able to add services

  Scenario Outline: Manager should be able to add services with the rest api
    Given Rest API is up and running and the user logs in as manager <user> and <pass>
    When Manager adds the new service <data>
    Then the service <data> should be created and added to the database
  Examples:
  |   user       |    pass    |                                      data                                             |
  |   Manager    |   Manager  |   {"serviceName": "Blower", "defaultDuration": 15, "description": "Secado de pelo"}   |

  Scenario Outline: Customer should not be able to add services with the rest api
    Given Rest API is up and running and the user logs in as customer <user> and <pass>
    Then Adding the new service <data> should fail
  Examples:
  |   user       |    pass    |                                      data                                             |
  |   Customer   |   Customer |   {"serviceName": "Blower", "defaultDuration": 15, "description": "Secado de pelo"}   |

  Scenario Outline: Stylist should not be able to add services with the rest api
    Given Rest API is up and running and the user logs in as stylist <user> and <pass>
    Then Adding the new service <data> should fail
  Examples:
  |   user       |    pass    |                                      data                                             |
  |   Stylist    |   Stylist  |   {"serviceName": "Blower", "defaultDuration": 15, "description": "Secado de pelo"}   |
