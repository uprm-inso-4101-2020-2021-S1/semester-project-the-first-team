import {
  faConciergeBell,
  faExclamation,
  faCalendarAlt,
  faCalendarPlus,
  faUsersCog,
  faCut,
  faSpa,
} from "@fortawesome/free-solid-svg-icons";

export function stylistSidebarRoutes(isActiveAppointment, stylist) {
  if(stylist)
    return [
      {
        title: "Reservations",
        path: "/stylists/reservations",
        icon: faConciergeBell,
        cName: "nav-text",
      },
      {
        title: "Active Reservation",
        path: "/stylists/activereservation",
        icon: isActiveAppointment ? faExclamation : faSpa,
        cName: "nav-text",
      },
      {
        title: "Manage Schedules",
        path: "/stylists/schedule/manage",
        icon: faCalendarPlus,
        cName: "nav-text",
      },
      {
        title: "View Schedule",
        path: "/stylists/schedule",
        icon: faCalendarAlt,
        cName: "nav-text",
      },

      {
        title: "View Users",
        path: "/stylists/userlist",
        icon: faUsersCog,
        cName: "nav-text",
      },
      {
        title: "Manage Services",
        path: "/stylists/manageservices",
        icon: faCut,
        cName: "nav-text",
      },
    ];
    return [
      {
        title: "Reservations",
        path: "/stylists/reservations",
        icon: faConciergeBell,
        cName: "nav-text",
      },
      {
        title: "Manage Schedules",
        path: "/stylists/schedule/manage",
        icon: faCalendarPlus,
        cName: "nav-text",
      },
      {
        title: "View Schedule",
        path: "/stylists/schedule",
        icon: faCalendarAlt,
        cName: "nav-text",
      },
  
      {
        title: "View Users",
        path: "/stylists/userlist",
        icon: faUsersCog,
        cName: "nav-text",
      },
      {
        title: "Manage Services",
        path: "/stylists/manageservices",
        icon: faCut,
        cName: "nav-text",
      },
    ];
}
