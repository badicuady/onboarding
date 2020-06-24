<script context="module">
  import { onMount } from "svelte";
  import config from "../config";
  import {
    SessionService,
    CacheService,
    CacheKeys,
    StateService,
    StateInfo,
    UsersService,
    DictionariesService,
    AdminService
  } from "../services";
  import Navigation from "../components/Navigation.svelte";
  import Footer from "../components/Footer.svelte";
  import Loading from "../components/Loading.svelte";
  import User from "../models/user.js";

  export async function preload(page, session) {
    const user = session[CacheKeys.UserInfo];
    const token = session[CacheKeys.Token];
    const rex = new RegExp(`\/${config.loginSegment}`, "gim");
    const isNotLogin = page.path.replace(rex, "").length !== 0;
    if (isNotLogin && config.useLogin && !user) {
      return this.redirect(302, config.loginSegment);
    }
    return new Promise(resolve => resolve({ user, token }));
  }
</script>

<script>
  export let segment;
  export let user;
  export let token;

  // do not delete: error Function called outside component initialization
  const sessionService = new SessionService();

  let userModel;
  let services = {};

  const setupServices = () => {
    if (token) {
      services = {
        [StateInfo.Services.Admin]: new AdminService(token.access_token),
        [StateInfo.Services.Users]: new UsersService(token.access_token),
        [StateInfo.Services.Dictionaries]: new DictionariesService(
          token.access_token
        )
      };
      StateService.updateServices(services);
    }
  };

  const updateDictionariesCaches = async dictionariesService => {
    const [
      departments,
      mandatoryTopics,
      timespans,
      responsibles
    ] = await Promise.all([
      dictionariesService.getDepartments(),
      dictionariesService.getMandatoryTopics(
        userModel.isManager ? undefined : true,
        userModel.isManager ? true : undefined
      ),
      dictionariesService.getTimespans(),
      dictionariesService.getResponsibles()
    ]);
    if (departments && departments.status === 200 && departments.data) {
      CacheService.setOrUpdateValue(
        CacheKeys.Departments,
        departments.data,
        new Date(Date.now() + 3600 * 1000)
      );
    }
    if (
      mandatoryTopics &&
      mandatoryTopics.status === 200 &&
      mandatoryTopics.data
    ) {
      CacheService.setOrUpdateValue(
        CacheKeys.MandatoryTopics,
        mandatoryTopics.data,
        new Date(Date.now() + 3600 * 1000)
      );
    }
    if (timespans && timespans.status === 200 && timespans.data) {
      CacheService.setOrUpdateValue(
        CacheKeys.Timespans,
        timespans.data,
        new Date(Date.now() + 3600 * 1000)
      );
    }
    if (responsibles && responsibles.status === 200 && responsibles.data) {
      CacheService.setOrUpdateValue(
        CacheKeys.Responsibles,
        responsibles.data,
        new Date(Date.now() + 3600 * 1000)
      );
    }
  };

  const updateCaches = async () => {
    if (services[StateInfo.Services.Dictionaries]) {
      await updateDictionariesCaches(services[StateInfo.Services.Dictionaries]);
    }
  };

  const updateItems = async () => {
    setupServices();
    await updateCaches();
  };

  const userChanged = async e => {
    if (services[StateInfo.Services.Users]) {
      const usersService = services[StateInfo.Services.Users];
      let activeUser = null;
      if (e.detail.subordinate) {
        const userInfo = await usersService.getUsers({
          userName:
            e.detail.subordinate.replace(" ", ".") + config.defaultEmailDomain
        });
		userModel.id = userInfo.data[0].id;
        activeUser = { id: userModel.id, name: `${userInfo.data[0].firstName} ${userInfo.data[0].lastName}` };
      } else {
		userModel.id = userModel.alteringUserId;
		activeUser = { id: userModel.alteringUserId, name: "Self" };
      }
      CacheService.setOrUpdateValue(
        CacheKeys.ActiveUser,
        activeUser,
        new Date(Date.now() + 3600 * 1000)
      );
      await sessionService.update({ [CacheKeys.UserInfo]: userModel });
    }
  };

  const sessionSubscribe = sessionService.subscribe(async session => {
    if (session[CacheKeys.UserInfo]) {
      user = session[CacheKeys.UserInfo];
      userModel = new User(user);
      CacheService.setOrUpdateValue(
        CacheKeys.UserInfo,
        user,
        new Date(Date.now() + 3600 * 1000)
      );
    }
    if (session[CacheKeys.Token]) {
      token = session[CacheKeys.Token];
      CacheService.setOrUpdateValue(
        CacheKeys.Token,
        token,
        new Date(Date.now() + 3600 * 1000)
      );
    }
    if (token && userModel) {
      await updateItems();
    }
  });

  const stateSubscribe = StateService.subscribe(async state => {
    services = state.getServices();
  });
</script>

<Loading />

<Navigation {segment} bind:user={userModel} on:userChanged={userChanged} />

<slot />

<Footer {segment} bind:user={userModel} />
