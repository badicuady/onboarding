<script>
  import { goto } from "@sapper/app";
  import { CacheKeys, SessionService } from "../services";
  import config from "../config";
  import ObjectCreator, { DefinitionType } from "../common/objectCreator.js";

  export let segment;
  export let user;
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
              Probationary plan
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
          {#if user.subordinate.length}
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
              <div class="dropdown-menu scroll-bar scroll-bar-200" aria-labelledby="navbarDropdown">
                {#each user.subordinate as subordinate, rowndx}
                  <a class="dropdown-item" href="##" on:click="{config.preventDefault}">{subordinate}</a>
                {/each}
              </div>
            </li>
          {/if}
        </ul>
      </div>

      <!-- Right navbar links -->
      <ul class="order-1 order-md-3 navbar-nav navbar-no-expand ml-auto">
        <li class="nav-item">
          <a href="//ipsos.com" class="nav-link" target="_blank">ITC</a>
        </li>
        <li class="nav-item">
          <a href="//italent.ipsos.com" class="nav-link" target="_blank">
            iTalent
          </a>
        </li>
        <li class="nav-item">
          <a
            href="//ipsosgroup.sharepoint.com/sites/Romania/Pages/Home.aspx"
            class="nav-link"
            target="_blank">
            Intranet
          </a>
        </li>
        <li class="nav-item">
          <span class="nav-link disabled">As <strong class="text-danger">self</strong></span>
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
          </div>
        </li>
      </ul>
    </div>
  </nav>
{/if}
