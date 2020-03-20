<script>
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";
  import config from "../config";
  import {
    SessionService,
    AdminService,
    CacheKeys,
    ApiService,
    CacheService
  } from "../services/index.js";
  import ObjectCreator, { DefinitionType } from "../common/objectCreator.js";
  import Utilities from "../common/utilities.js";
  import loadingStore from "../services/loading.service.js";

  const sessionService = new SessionService();
  const apiService = new ApiService();

  let loginParams;
  let email;
  let password;
  let formWasValidated = false;
  let loginFailed = false;

  onMount(() => {
    loginParams = Utilities.uriParametersToPlainObject();
    Utilities.debugVariable({ loginParams });
  });

  const adjustUser = user => {
    if (user && user.manager) {
      user.manager = user.manager
        .split(",")
        .map(e => e.split("="))
        .reduce((all, e) => ({ ...all, [e[0]]: e[1] }), {}).CN;
    }
    Utilities.debugVariable({ user });
    return user;
  };

  const saveUserInfo = async token => {
	const adminService = new AdminService(token.data.access_token);
	CacheService.setOrUpdateValue(CacheKeys.AdminService, adminService, new Date(Date.now() + 3600 * 1000));
    const userInfo = await adminService.info();
    if (userInfo.status === 200) {
      CacheService.setOrUpdateValue(CacheKeys.Token, token.data, new Date(Date.now() + 3600 * 1000));
      const userInfoObj = adjustUser(userInfo.data.payload);
      await sessionService.update({ [CacheKeys.UserInfo]: userInfoObj });
      CacheService.setOrUpdateValue(CacheKeys.UserInfo, userInfoObj, new Date(Date.now() + 3600 * 1000));
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
      window.location.href = `${loginParams.redirect_uri}?${Utilities.plainObjectToUriParameters(authParams)}`;
	}
  };

  const login = async (e) => {
	loadingStore.setVisible();
    if (validate(e)) {
      const token = await apiService.token(email, password);
      loginFailed = !!(token && token.data && token.data.error);
      if (!loginFailed) {
		loginStrategy(token);
      }
    }
    loadingStore.setInvisible();
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

{#if !loginFailed}
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
                          required />
                      </div>
                    </div>
                    <div class="form-group row">
                      <label for="email" class="col-sm-1 col-form-label">
                        <i class="fas fa-unlock-alt" />
                      </label>
                      <div class="col-sm-11">
                        <input
                          type="password"
                          class="form-control"
                          id="password"
                          name="password"
                          bind:value={password}
                          placeholder="domain password"
                          required />
                      </div>
                    </div>
                    <div class="form-group row">
                      <div class="col-sm-1">&nbsp;</div>
                      <div class="col-sm-11">
                        <div class="custom-control custom-switch">
                          <input
                            class="custom-control-input"
                            type="checkbox"
                            id="rememberme"
                            name="rememberme"
                            checked />
                          <label class="custom-control-label" for="rememberme">
                            Remember me
                          </label>
                        </div>
                      </div>
                    </div>
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
