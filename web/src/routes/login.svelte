<script>
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";
  import config from "../config";
  import {
    SessionService,
    AdminService,
    CacheKeys,
    ApiService,
    CacheService,
    UsersService,
    DictionariesService
  } from "../services/index.js";
  import ObjectCreator, { DefinitionType } from "../common/objectCreator.js";
  import Utilities from "../common/utilities.js";
  import loadingStore from "../services/loading.service.js";

  // do not delete: error Function called outside component initialization
  const sessionService = new SessionService();
  const apiService = new ApiService();
  const passwordTypeMap = new Map([[true, "password"], [false, "text"]]);

  let loginParams;
  let email = "";
  let password = "";
  let formWasValidated = false;
  let loginFailed = undefined;
  let networkFailed = undefined;
  let hidePassword = true;
  let passwordType = passwordTypeMap.get(hidePassword);

  onMount(() => {
    loginParams = Utilities.uriParametersToPlainObject();
    Utilities.debugVariable({ loginParams });
  });

  const passwordChanged = e => {
    password = e.target.value;
  };

  const changePasswordType = e => {
    hidePassword = !hidePassword;
    passwordType = passwordTypeMap.get(hidePassword);
  };

  const parseUser = user =>
    user
      .split(",")
      .map(e => e.split("="))
      .reduce((all, e) => ({ ...all, [e[0]]: e[1] }), {}).CN;

  const adjustUser = user => {
    if (user && user.manager) {
      user.manager = user.manager
        .split(",")
        .map(e => e.split("="))
        .reduce((all, e) => ({ ...all, [e[0]]: e[1] }), {}).CN;
      user.isManager = (user.directReports || "").length > 0;
      if (typeof user.directReports === "string") {
        user.subordinate = [parseUser(user.directReports)];
      }
      if (user.directReports instanceof Array) {
        user.subordinate = user.directReports.map(parseUser);
      }
      user.isHr =
        user.groups.findIndex(
          e => config.hrGroupName.localeCompare(e, "kf") === 0
        ) >= 0;
    }
    return user;
  };

  const saveUserInfo = async token => {
    const adminService = new AdminService(token.data.access_token);
    const userInfo = await adminService.info();
    if (userInfo.status === 200) {
      Utilities.debugVariable({ token: token.data });
      await sessionService.update({ [CacheKeys.Token]: token.data });
      CacheService.setOrUpdateValue(
        CacheKeys.Token,
        token.data,
        new Date(Date.now() + 3600 * 1000)
      );
      const userInfoObj = adjustUser(userInfo.data.payload);
      Utilities.debugVariable({ user: userInfoObj });
      await sessionService.update({ [CacheKeys.UserInfo]: userInfoObj });
      CacheService.setOrUpdateValue(
        CacheKeys.UserInfo,
        userInfoObj,
        new Date(Date.now() + 3600 * 1000)
      );
    }
  };

  const validate = e => {
    const $from = window.$(e.target).parents("form");
    const isValid = $from.get(0).checkValidity();
    formWasValidated = true;
    return isValid;
  };

  const loginStrategy = async token => {
    if (!loginParams) {
      await saveUserInfo(token);
      goto("/");
    }
    if (loginParams) {
      const authParams = { ...token.data, state: loginParams.state };
      window.location.href = `${
        loginParams.redirect_uri
      }?${Utilities.plainObjectToUriParameters(authParams)}`;
    }
  };

  const login = async e => {
    loadingStore.setVisible();
    networkFailed = false;
    loginFailed = false;
    if (validate(e)) {
      const token = await apiService.token(email, password);
      networkFailed = !!(
        token &&
        token.data &&
        token.data.error &&
        token.data.error.response.data.error.code === "ENOTFOUND"
      );
      if (!networkFailed) {
        loginFailed = !!(token && token.data && token.data.error);
        if (!loginFailed) {
          loginStrategy(token);
        }
      }
    }
    loadingStore.setInvisible();
  };

  const loginFromEnter = async e => {
    if (e.keyCode === 13) {
      login(e);
    }
  };

  const checkboxChange = e => {
    console.log(e);
  };
</script>

<svelte:head>
  <style type="text/css">
    body {
      background-color: #f4f6f9;
    }
    .with-image {
      background-image: url("/img/login_1.png");
      background-repeat: no-repeat;
      background-position-x: right;
      background-position-y: -35px;
    }
  </style>
</svelte:head>

{#if loginFailed || true}
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="card mt-5 with-image">
          <div class="card-body m-5">
            <div class="container m-5">
              <div class="row">
                <div class="col-5 mr-auto">
                  <form
                    class="needs-validation"
                    novalidate
                    class:was-validated={formWasValidated}>
                    <h1 class="text-center mb-5 font-weight-bold">
                      OnBoarding
                    </h1>
                    <div
                      class="text-center text-danger mb-3"
                      class:visible={loginFailed}
                      class:invisible={!loginFailed}>
                      <strong>User name or password are invalid!</strong>
                    </div>
                    <div
                      class="text-center text-danger mb-3"
                      class:visible={networkFailed}
                      class:invisible={!networkFailed}>
                      <strong>Internal network not available! (Disconnected from VPN?)</strong>
                    </div>
                    <div class="form-group row">
                      <label for="email" class="col-sm-1 col-form-label">
                        <i class="fas fa-user" />
                      </label>
                      <div class="col-sm-11">
                        <input
                          type="email"
                          class="form-control"
                          id="email"
                          name="email"
                          bind:value={email}
                          placeholder="name@ipsos.com"
                          required
                          autocomplete="username"
                          on:keypress={loginFromEnter} />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label for="email" class="col-sm-1 col-form-label">
                        <i class="fas fa-unlock-alt" />
                      </label>
                      <div class="col-sm-11">
                        <div class="input-group">
                          <input
                            type={passwordType}
                            class="form-control"
                            id="password"
                            name="password"
                            value={password}
                            placeholder="domain password"
                            required
                            autocomplete="current-password"
                            on:input={passwordChanged}
                            on:keypress={loginFromEnter} />
                          <div class="input-group-append">
                            <span
                              class="input-group-text bg-white cursor-pointer"
                              on:click={changePasswordType}>
                              <i
                                class="far"
                                class:fa-eye={hidePassword}
                                class:fa-eye-slash={!hidePassword} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--div class="form-group row">
                      <div class="col-sm-1">&nbsp;</div>
                      <div class="col-sm-11">
                        <div class="custom-control custom-switch">
                          <input
                            class="custom-control-input"
                            type="checkbox"
                            id="rememberme"
                            name="rememberme"
                            checked
                            on:change={checkboxChange} />
                          <label class="custom-control-label" for="rememberme">
                            Remember me
                          </label>
                        </div>
                      </div>
                    </div-->
                    <div class="form-group row mt-5">
                      <div class="col-sm-12">
                        <button
                          type="button"
                          class="btn btn-info btn-lg btn-block"
                          on:click={login}>
                          Log in
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <!-- div.col-4 -->
              </div>
              <!-- div.row -->
            </div>
          </div>
          <!-- div.container -->
        </div>
        <!-- div.jumbotron -->
      </div>
    </div>
  </div>
{/if}
