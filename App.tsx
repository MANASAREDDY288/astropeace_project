import { Route, Routes, useNavigate } from "react-router-dom";
import React from "react";
import { effect } from "@preact/signals-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

import DefaultLayout from "./layouts/default-layout";
import SignUp from "./app/auth/signup";
import ForgotPassword from "./app/auth/forgotpassword";
import Login from "./app/auth/login";
import Account from "./app/account";
import Permissions from "./app/permissions";
import AppHttp from "./utils/services/app.http";
import Transactions from "./app/reports/transactions";
import Mantra from "./app/activities/mantras";
import TestForm from "./app/test-form";
import Chats from "./app/support/chats";
import Site from "./app/application-data/site-info";
import User from "./app/profile/user";
import Astrologers from "./app/profile/astrologers";
import Clienttestimonial from "./app/application-data/testimonial";
import ActivityPooja from "./app/activities/poojas";
import Donation from "./app/activities/donations";
import Shippingcharges from "./app/settings/shipping-charges";
import Contactus from "./app/support/contact-us";
import Activities from "./app/home/activities";
import Notifications from "./app/settings/notifications";
import Dashboard from "./app/home/dashboard";
import Admin from "./app/home/admin";
import ZodiacSigns from "./app/horoscope/zodiacsigns";
import Daily from "./app/horoscope/daily";
import Weekly from "./app/horoscope/weekly";
import Monthly from "./app/horoscope/monthly";
import Yearly from "./app/horoscope/yearly";
import MenuLinks from "./app/menu/menulinks";
import MenuRoles from "./app/menu/menuroles";
import MenuAccess from "./app/menu/menuaccess";
import AuspiciousName from "./app/auspicious/names";
import Timings from "./app/auspicious/timings";
import ServicePooja from "./app/services/poojas";
import SubscriptionPlans from "./app/settings/subscriptionPlans";
import StaffScreen from "./app/profile/staff";
import ReportUserScreen from "./app/reports/user";
import ReportAstrologerScreen from "./app/reports/astrologers";
import Chatconversation from "./app/support/chatconversation";

import { RouterEvent } from "@/utils/services/app.event";
import AppToast from "@/utils/components/app-toast";
import { AppRouter } from "@/utils/services/app.router";

ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
  const navigate = useNavigate();

  React.useEffect(() => {
    AppHttp.BaseUrl();
    effect(() => {
      const path = RouterEvent.value.pathname;
      const queryString = new URLSearchParams(
        RouterEvent.value.query ?? {},
      ).toString();

      if (path) {
        const fullPath = queryString ? `${path}?${queryString}` : path;

        if (window.location.pathname + window.location.search !== fullPath) {
          navigate(fullPath);
        }
      }
    });
  }, []);

  return (
    <>
      <AppToast />
      <DefaultLayout>
        <Routes>
          <Route element={<Dashboard />} path={AppRouter.DASHBOARD} />
          <Route element={<Login />} path={AppRouter.DEFAULT} />
          <Route element={<Login />} path={AppRouter.LOGIN} />
          <Route element={<SignUp />} path={AppRouter.SIGN_UP} />
          <Route
            element={<ForgotPassword />}
            path={AppRouter.FORGOT_PASSWORD}
          />
          <Route element={<Account />} path={AppRouter.ACCOUNT} />
          <Route element={<Permissions />} path={AppRouter.PERMISSIONS} />
          <Route element={<Transactions />} path={AppRouter.TRANSACTIONS} />
          <Route element={<Mantra />} path={AppRouter.MANTRA} />
          <Route element={<ActivityPooja />} path={AppRouter.ACTIVITYPOOJA} />
          <Route element={<Donation />} path={AppRouter.DONATION} />
          <Route element={<ServicePooja />} path={AppRouter.SERVICEPOOJA} />
          <Route element={<TestForm />} path={AppRouter.TESTFORM} />
          <Route element={<Chats />} path={AppRouter.CHAT} />
          <Route element={<Site />} path={AppRouter.SITEINFO} />
          <Route element={<User />} path={AppRouter.USERS} />
          <Route element={<Notifications />} path={AppRouter.NOTIFICATIONS} />
          <Route
            element={<SubscriptionPlans />}
            path={AppRouter.SUBSCRIPTIONPLANS}
          />
          <Route
            element={<ZodiacSigns />}
            path={AppRouter.HOROSCOPE_ZODIAC_SIGNS}
          />
          <Route element={<Daily />} path={AppRouter.HOROSCOPE_DAILY} />
          <Route element={<Weekly />} path={AppRouter.HOROSCOPE_WEEKLY} />
          <Route element={<Monthly />} path={AppRouter.HOROSCOPE_MONTHLY} />
          <Route element={<Yearly />} path={AppRouter.HOROSCOPE_YEARLY} />
          <Route element={<MenuAccess />} path={AppRouter.MENU_ACCESS} />
          <Route element={<MenuLinks />} path={AppRouter.MENU_LINKS} />
          <Route element={<MenuRoles />} path={AppRouter.MENU_ROLES} />
          <Route
            element={<Astrologers />}
            path={AppRouter.PROFILE_ASTROLOGERS}
          />
          <Route element={<Activities />} path={AppRouter.PROFILE_ACTIVITIES} />
          <Route element={<Timings />} path={AppRouter.TIMINGS} />
          <Route element={<AuspiciousName />} path={AppRouter.TIMING_NAMES} />
          <Route
            element={<Clienttestimonial />}
            path={AppRouter.CLIENTTESTIMONIAL}
          />
          <Route
            element={<Shippingcharges />}
            path={AppRouter.SHIPPINGCHARGES}
          />
          <Route element={<Contactus />} path={AppRouter.CONTACTUS} />
          <Route element={<Admin />} path={AppRouter.ADMIN} />
          <Route element={<StaffScreen />} path={AppRouter.STAFF} />
          <Route element={<ReportUserScreen />} path={AppRouter.REPORTUSERS} />
          <Route
            element={<ReportAstrologerScreen />}
            path={AppRouter.REPORTASTROLOGERS}
          />

          <Route
            element={<Chatconversation />}
            path={AppRouter.SUPPORT_CHAT_CONVERSATIONS}
          />
        </Routes>
      </DefaultLayout>
    </>
  );
}

export default App;
