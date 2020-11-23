Feature: UI login page
  Users should be able to access the UI and login with their credentials

  Scenario Outline: Managers and Stylist should be able to login and redirect to appropriate page
    Given The user goes to the UI website
    When The user logins as <user> and <pass>
    Then The user should see the stylists page
  Examples:
  |   user       |    pass    |
  |   Manager    |   Manager  |
  |   Stylist    |   Stylist  |

  Scenario Outline: Customers should be able to login and redirect to appropriate page
    Given The user goes to the UI website
    When The user logins as <user> and <pass>
    Then The user should see the customers page
  Examples:
  |   user       |    pass    |
  |   Customer   |   Customer |
