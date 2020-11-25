Feature: Walkthrough whole system
  Service should at least have the following functionality to comply with design

  Scenario Outline: Managers should be able to use the system to create stylists
    Given The user goes to the UI website
    When The user logins as <user> and <pass>
    And The user goes to the users tab
    Then The Manager should be able to create the stylist <stylist_user> <stylist_pass> <stylist_first> <stylist_last> <stylist_email>
    Then The Manager should be able to see the stylist
  Examples:
  |   user       |    pass    | stylist_user | stylist_pass | stylist_first | stylist_last | stylist_email           |
  |   Manager    |   Manager  |   maria64    | mAriA572433  |     Maria     |    Nieves    | maria.nieves827@upr.edu |

#   Scenario Outline: Managers should be able to set the stylists schedule. This will be in the current day
#     Given The user goes to the UI website
#     When The user logins as <user> and <pass>
#     And The user goes to the manage schedule tab
#     Then The Manager should be able to create a schedule for the stylist <stylist_name>
#     Then The Manager should be able to see the stylists <stylist_name> schedule
#     Then The Manager should be able to logout
#   Examples:
#   |   user       |    pass    | stylist_name |
#   |   Manager    |   Manager  | Maria Nieves |

#   Scenario Outline: Customers should be able to create account
#     Given The user goes to the UI website
#     When The customer clicks to sign up 
#     And The customer is redirected to the signup page
#     Then The customer should be able to sign up as <cust_user> <cust_pass> <cust_first> <cust_last> <cust_email>
#     Then The customer should be able to click on the login button
#     Then The customer should be able to log in as <cust_user> and <cust_pass>
#   Examples:
#   |         cust_user     |     cust_pass     | cust_first | cust_last |        cust_email       |
#   |    luisitotucupey23   |  luisitoelmejor37 |    Luis    |  Bambino  | luisBambino23@yahoo.com |

#   Scenario Outline: Customers should be able to create a reservation
#     Given The user goes to the UI website
#     When The user logins as <cust_user> and <cust_pass>
#     And The user goes to the reservation tab
#     Then The customer should be able to create a reservation for the <service> with the stylist <stylist_name>  
#     Then The customer should be able to see the reservation created
#   Examples:
#   |         cust_user     |     cust_pass     | cust_first | cust_last |        cust_email       |
#   |    luisitotucupey23   |  luisitoelmejor37 |    Luis    |  Bambino  | luisBambino23@yahoo.com |
