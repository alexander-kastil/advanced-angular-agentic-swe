import { Routes } from '@angular/router';
import { DemoContainerComponent } from './demo-container/demo-container.component';
import { AnimateEnterLeaveComponent } from './samples/animate-enter-leave/animate-enter-leave.component';
import { DetailsStageComponent } from './samples/animate-enter-leave/stages/details-stage.component';
import { OverviewStageComponent } from './samples/animate-enter-leave/stages/overview-stage.component';
import { AppInitComponent } from './samples/app-init/app-init.component';
import { AppInitializerAsyncComponent } from './samples/app-initializer-async/app-initializer-async.component';
import { CanMatchGuardComponent } from './samples/can-match-guard/can-match-guard.component';
import { featureAccessGuard } from './samples/can-match-guard/feature-access.guard';
import { HttpErrorsComponent } from './samples/http-errors/http-errors.component';
import { MembersComponent } from './samples/multi-guard/members/members.component';
import { MultiGuardComponent } from './samples/multi-guard/multi-guard.component';
import { onlyAuthenticatedGuard } from './samples/multi-guard/only-authenticated.guard';
import { onlyPrimeMembersGuard } from './samples/multi-guard/only-prime-members.guard';
import { PrimeComponent } from './samples/multi-guard/prime/prime.component';
import { MultiInterceptorComponent } from './samples/multi-interceptor/multi-interceptor.component';
import { BrokenPanelComponent } from './samples/navigation-errors/broken-panel.component';
import { brokenResolver } from './samples/navigation-errors/broken.resolver';
import { NavigationErrorsComponent } from './samples/navigation-errors/navigation-errors.component';
import { PreloadingStrategyComponent } from './samples/preloading-strategy/preloading-strategy.component';
import { CatalogStore } from './samples/route-driven-store/catalog.store';
import { RouteDrivenStoreComponent } from './samples/route-driven-store/route-driven-store.component';
import { InheritedParamsComponent } from './samples/route-inputs/inherited-params/inherited-params.component';
import { RouteInputsComponent } from './samples/route-inputs/route-inputs.component';
import { albumResolver } from './samples/route-resolvers-signals/route-resolver';
import { RouteResolversSignalsComponent } from './samples/route-resolvers-signals/route-resolvers-signals.component';
import { RouteTitlesComponent } from './samples/route-titles/route-titles.component';
import { RouterAnimationsComponent } from './samples/router-animations/router-animations.component';
import { RouterBindingsComponent } from './samples/router-bindings/router-bindings.component';
import { RouteScopedNotesService } from './samples/service-migration/route-scoped-notes.service';
import { ServiceMigrationComponent } from './samples/service-migration/service-migration.component';
import { ViewTransitionsComponent } from './samples/view-transitions/view-transitions.component';
import { WebmcpNavigationComponent } from './samples/webmcp-navigation/webmcp-navigation.component';

export const demoRoutes: Routes = [
  {
    path: '',
    component: DemoContainerComponent,
    children: [
      {
        path: 'app-init',
        component: AppInitComponent,
        title: 'App Initialization & inject',
      },
      {
        path: 'app-initializer-async',
        component: AppInitializerAsyncComponent,
        title: 'Async App Initializer',
      },
      {
        path: 'service-migration',
        component: ServiceMigrationComponent,
        title: 'Service Decorator & Migration',
        providers: [RouteScopedNotesService],
      },
      {
        path: 'http-errors',
        component: HttpErrorsComponent,
        title: 'Error Handling',
      },
      {
        path: 'multi-interceptor',
        component: MultiInterceptorComponent,
        title: 'HTTP Interceptors',
      },
      {
        path: 'navigation-errors',
        component: NavigationErrorsComponent,
        title: 'Navigation Errors',
        children: [
          {
            path: 'broken',
            component: BrokenPanelComponent,
            resolve: { data: brokenResolver },
          },
        ],
      },
      {
        path: 'router-bindings',
        component: RouterBindingsComponent,
        title: 'Component Input Bindings',
      },
      {
        path: 'route-inputs',
        pathMatch: 'full',
        redirectTo: 'route-inputs/acme/reports',
      },
      {
        path: 'route-inputs/:tenant',
        component: RouteInputsComponent,
        title: 'Route Input Bindings',
        data: { release: '22.1' },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'reports',
          },
          {
            path: ':section',
            component: InheritedParamsComponent,
          },
        ],
      },
      {
        path: 'route-titles',
        component: RouteTitlesComponent,
        title: 'Route Titles',
      },
      {
        path: 'route-resolvers-signals',
        pathMatch: 'full',
        redirectTo: 'route-resolvers-signals/1',
      },
      {
        path: 'route-resolvers-signals/:id',
        component: RouteResolversSignalsComponent,
        title: 'Route Resolvers with Signals',
        resolve: { album: albumResolver },
      },
      {
        path: 'can-match-guard',
        component: CanMatchGuardComponent,
        title: 'CanMatch Guard',
        children: [
          {
            path: 'prime-feature',
            canMatch: [featureAccessGuard],
            loadComponent: () =>
              import('./samples/can-match-guard/prime-feature/prime-feature.component').then(
                (m) => m.PrimeFeatureComponent
              ),
          },
        ],
      },
      {
        path: 'multi-guard',
        component: MultiGuardComponent,
        title: 'Route Guards',
        children: [
          {
            path: 'members',
            component: MembersComponent,
            canActivate: [onlyAuthenticatedGuard],
          },
          {
            path: 'prime',
            component: PrimeComponent,
            canActivate: [onlyAuthenticatedGuard, onlyPrimeMembersGuard],
          },
        ],
      },
      {
        path: 'preloading-strategy',
        component: PreloadingStrategyComponent,
        title: 'Preloading Strategy',
      },
      {
        path: 'route-driven-store',
        pathMatch: 'full',
        redirectTo: 'route-driven-store/all',
      },
      {
        path: 'route-driven-store/:category',
        component: RouteDrivenStoreComponent,
        title: 'Route Driven Signal Store',
        providers: [CatalogStore],
      },
      {
        path: 'router-animations',
        component: RouterAnimationsComponent,
        title: 'Router Animations',
      },
      {
        path: 'animate-enter-leave',
        component: AnimateEnterLeaveComponent,
        title: 'Animate Enter and Leave',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'overview',
          },
          {
            path: 'overview',
            component: OverviewStageComponent,
          },
          {
            path: 'details',
            component: DetailsStageComponent,
          },
        ],
      },
      {
        path: 'view-transitions',
        component: ViewTransitionsComponent,
        title: 'View Transitions',
      },
      {
        path: 'webmcp-navigation',
        component: WebmcpNavigationComponent,
        title: 'WebMCP Navigation Tools',
      },
    ],
  },
];
