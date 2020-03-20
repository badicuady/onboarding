<script>
  import { goto } from "@sapper/app";
  import { CacheKeys, SessionService } from "../services";
  import config from "../config";
  import ObjectCreator, { DefinitionType } from "../common/objectCreator.js";

  export let segment;
  export let user;
  const sessionService = new SessionService();

  const createObject = (keyName, value) =>
    ObjectCreator.createObjectProperty({}, keyName, DefinitionType.A, {
      ...value
    });
  const logout = async () => {
    const userInfoObj = createObject(CacheKeys.UserInfo, null);
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
            <a
              href="/specialists"
              class="nav-link"
              class:active={!segment || segment === 'specialists'}>
              Specialists
            </a>
          </li>
          <li class="nav-item">
            <a
              href="/managers"
              class="nav-link"
              class:active={segment === 'managers'}>
              Managers
            </a>
          </li>
          <li class="nav-item">
            <a
              href="/goals"
              class="nav-link"
              class:active={segment === 'goals'}>
              Goals
            </a>
          </li>
        </ul>
      </div>

      <!-- Right navbar links -->
      <ul class="order-1 order-md-3 navbar-nav navbar-no-expand ml-auto">
        <!-- Notifications Dropdown Menu -->
        <li class="nav-item dropdown">
          <a
            class="nav-link"
            data-toggle="dropdown"
            href="#"
            title="Notifications">
            <i class="far fa-bell" />
            <span class="badge badge-warning navbar-badge">15</span>
          </a>
          <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <span class="dropdown-header">15 Notifications</span>
            <div class="dropdown-divider" />
            <a href="#" class="dropdown-item">
              <i class="fas fa-envelope mr-2" />
              4 new messages
              <span class="float-right text-muted text-sm">3 mins</span>
            </a>
            <div class="dropdown-divider" />
            <a href="#" class="dropdown-item">
              <i class="fas fa-users mr-2" />
              8 friend requests
              <span class="float-right text-muted text-sm">12 hours</span>
            </a>
            <div class="dropdown-divider" />
            <a href="#" class="dropdown-item">
              <i class="fas fa-file mr-2" />
              3 new reports
              <span class="float-right text-muted text-sm">2 days</span>
            </a>
            <div class="dropdown-divider" />
            <a href="#" class="dropdown-item dropdown-footer">
              See All Notifications
            </a>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link" data-toggle="dropdown" href="#" title="Profile">
            <i class="fas fa-th-large" />
          </a>
          <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <!-- Message Start -->
            <div class="media px-3 py-2">
              <div class="media-body">
                <h3 class="dropdown-item-title">{user.displayName}</h3>
                <p class="text-sm">{user.mail}</p>
                <p class="text-sm text-muted">{user.department}</p>
              </div>
            </div>
            <!-- Message End -->
            <div class="dropdown-divider" />
            <a
              href="#"
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
