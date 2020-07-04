<script>
  import { goto } from "@sapper/app";
  import { CacheService, CacheKeys, SessionService } from "../services";
  import { onDestroy, createEventDispatcher } from "svelte";
  import config from "../config";
  import ObjectCreator, { DefinitionType } from "../common/objectCreator.js";
  import savingStore from "../services/saving.service.js";

  export let segment;
  export let user;
  let saveState = 0;
  let activeUser = { id: -1, name: "Self" };

  const dispatch = createEventDispatcher();

  // do not delete: error Function called outside component initialization
  const sessionService = new SessionService();

  const logout = async () => {
    const userInfoObj = ObjectCreator.createObjectProperty(
      {},
      CacheKeys.UserInfo,
      DefinitionType.A,
      null
    );
    await sessionService.update(userInfoObj);
    goto(config.loginSegment);
  };

  const userChanged = async (e, subordinate) => {
    dispatch("userChanged", {
      original: e,
      subordinate
    });
  };

  const savingSubscribe = savingStore.subscribe(value => {
    saveState = value;
    if (saveState === 2) {
      setTimeout(() => (saveState = 0), 3000);
    }
  });

  const cacheSubscribe = CacheService.subscribe(cache => {
	activeUser = cache.get(CacheKeys.ActiveUser) || { id: -1, name: "Self" };
  });

  onDestroy(() => {
    savingSubscribe();
    cacheSubscribe();
  });
</script>

{#if user && user.displayName && segment !== 'login'}
  <nav
    class="main-header navbar navbar-expand-md navbar-light navbar-white
    sticky-top">
    <div class="container">
      <a href="/" class="navbar-brand">
        <span class="brand-text font-weight-light">OnBoarding</span>
      </a>

      <button
        class="navbar-toggler order-1"
        type="button"
        data-toggle="collapse"
        data-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" />
      </button>

      <div class="collapse navbar-collapse order-3" id="navbarCollapse">
        <!-- Left navbar links -->
        <ul class="navbar-nav">
          <li class="nav-item">
            <a href="/" class="nav-link" class:active={!segment}>
              {user.isManager ? 'Managers' : 'Specialists'}
            </a>
          </li>
          <li class="nav-item">
            <a
              href="/probationaryplan"
              class="nav-link"
              class:active={segment === 'probationaryplan'}>
              Probationary&nbsp;plan
            </a>
          </li>
          <li class="nav-item">
            <a
              href="/resources"
              class="nav-link"
              class:active={segment === 'resources'}>
              Resources
            </a>
          </li>
          {#if user.IsHr}
            <li class="nav-item">
              <a
                href="/reports"
                class="nav-link"
                class:active={segment === 'reports'}>
                Reports
              </a>
            </li>
          {/if}
          {#if user.subordinate && user.subordinate.length}
            <li class="nav-item dropdown">
              <a
                href="##"
                class="nav-link dropdown-toggle"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
                Subordinates
              </a>
              <div
                class="dropdown-menu scroll-bar scroll-bar-200"
                aria-labelledby="navbarDropdown">
                <a
                  class="dropdown-item"
                  href="##"
                  on:click={e => userChanged(e)}>
                  Self
                </a>
                <div class="dropdown-divider" />
                {#each user.subordinate as subordinate, rowndx}
                  <a
                    class="dropdown-item"
                    href="##"
                    on:click={e => userChanged(e, subordinate)}>
                    {subordinate}
                  </a>
                {/each}
              </div>
            </li>
          {/if}
        </ul>
      </div>

      <!-- Right navbar links -->
      <ul class="order-1 order-md-3 navbar-nav navbar-no-expand ml-auto">
        <li class="nav-item">
          <span class="navbar-text text-secondary">
            {#if saveState === 1}Communicating...{/if}
            {#if saveState === 2}
              <strong>DONE!</strong>
            {/if}
            {#if saveState === 3}
              <strong class="text-danger">ERROR!</strong>
            {/if}
          </span>
        </li>
        <li class="nav-item dropdown">
          <a
            href="##"
            class="nav-link dropdown-toggle"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false">
            Useful links
          </a>
          <div
            class="dropdown-menu scroll-bar scroll-bar-200"
            aria-labelledby="navbarDropdown">
            {#if !user.isManager}
              <a
                href="//ipsos.com?EmployeeGuideline"
                class="nav-link"
                target="_blank">
                Employee guideline
              </a>
            {/if}
            {#if user.isManager}
              <a
                href="//ipsos.com?ManagerToolkit"
                class="nav-link"
                target="_blank">
                Manager toolkit
              </a>
            {/if}
            <a
              href="//campus.ipsos-trainingcenter.com/students/students/login"
              class="dropdown-item"
              target="_blank">
              ITC
            </a>
            <a
              href="//ipsosgroup-my.sharepoint.com/:f:/r/personal/romina_pricopie_ipsos_com/Documents/New%20Hire%20Orientation%202020"
              class="dropdown-item"
              target="_blank">
              New Hire Orientation
            </a>
            <a href="//italent.ipsos.com" class="dropdown-item" target="_blank">
              iTalent
            </a>
            <a
              href="//ipsosgroup.sharepoint.com/sites/Romania/Pages/Home.aspx"
              class="dropdown-item"
              target="_blank">
              Intranet
            </a>
          </div>
        </li>
        <li class="nav-item">
          <span class="nav-link disabled">
            As
            <strong class="text-danger">{activeUser.name}</strong>
          </span>
        </li>
        <!-- Notifications Dropdown Menu -->
        <li class="nav-item dropdown">
          <a class="nav-link" data-toggle="dropdown" href="##" title="Profile">
            <i class="fas fa-th-large" />
          </a>
          <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <!-- Message Start -->
            <div class="media px-3 py-2">
              <div class="media-body">
                <h3 class="dropdown-item-title">{user.displayName}</h3>
                <p class="text-sm">{user.mail}</p>
                <p class="text-sm text-muted">{user.department}</p>
                <p class="text-sm text-muted">{user.manager}</p>
              </div>
            </div>
            <!-- Message End -->
            <div class="dropdown-divider" />
            <a
              href="##"
              class="btn btn-primary btn-xs text-right m-2 float-right"
              on:click={logout}>
              Log out
            </a>
            <a
              href="/contact"
              class="btn btn-primary btn-xs text-right my-2 float-right">
              Contact
            </a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
{/if}
