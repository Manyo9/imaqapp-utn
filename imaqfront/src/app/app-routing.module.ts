import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/visual/not-found/not-found.component';
import { ServicesComponent } from './components/customer-side/services/services.component';
import { SparePartsComponent } from './components/customer-side/spare-parts/spare-parts.component';
import { RentalsComponent } from './components/customer-side/rentals/rentals.component';
import { OffersComponent } from './components/customer-side/offers/offers.component';
import { RequestsComponent } from './components/manager-side/requests/requests.component';
import { ManageOffersComponent } from './components/manager-side/manage-offers/manage-offers.component';
import { ManageSuppliersComponent } from './components/manager-side/manage-suppliers/manage-suppliers.component';
import { ManageProductsComponent } from './components/manager-side/manage-products/manage-products.component';
import { StatisticsComponent } from './components/manager-side/statistics/statistics.component';
import { ListUserComponent } from './components/admin-side/users/list-user/list-user.component';
import { NewUserComponent } from './components/admin-side/users/new-user/new-user.component';
import { EditUserComponent } from './components/admin-side/users/edit-user/edit-user.component';
import { EditSupplierComponent } from './components/manager-side/manage-suppliers/edit-supplier/edit-supplier.component';
import { NewSupplierComponent } from './components/manager-side/manage-suppliers/new-supplier/new-supplier.component';
import { NewProductComponent } from './components/manager-side/manage-products/new-product/new-product.component';
import { EditProductComponent } from './components/manager-side/manage-products/edit-product/edit-product.component';
import { LoginComponent } from './components/session/login/login.component';
import { ProfileComponent } from './components/session/profile/profile.component';
import { ChangePasswordComponent } from './components/session/change-password/change-password.component';
import { ManageRentablesComponent } from './components/manager-side/manage-rentables/manage-rentables.component';
import { NewRentableComponent } from './components/manager-side/manage-rentables/new-rentable/new-rentable.component';
import { EditRentableComponent } from './components/manager-side/manage-rentables/edit-rentable/edit-rentable.component';
import { NewOfferComponent } from './components/manager-side/manage-offers/new-offer/new-offer.component';
import { EditOfferComponent } from './components/manager-side/manage-offers/edit-offer/edit-offer.component';
import { DetailsRentalsComponent } from './components/manager-side/requests/details-rentals/details-rentals.component';
import { DetailsOffersComponent } from './components/manager-side/requests/details-offers/details-offers.component';
import { DetailsServicesComponent } from './components/manager-side/requests/details-services/details-services.component';
import { DetailsSparePartsComponent } from './components/manager-side/requests/details-spare-parts/details-spare-parts.component';
import { CancelRequestComponent } from './components/customer-side/cancel-request/cancel-request.component';
import { OfferDetailsComponent } from './components/manager-side/manage-offers/offer-details/offer-details.component';
import { OfferDetailsCustomerComponent } from './components/customer-side/offers/offer-details-customer/offer-details-customer.component';
import { FaqComponent } from './components/visual/faq/faq.component';
import { CustomersComponent } from './components/visual/customers/customers.component';
import { OfferRequestComponent } from './components/customer-side/offers/offer-request/offer-request.component';
import { InvoicesComponent } from './components/manager-side/invoices/invoices.component';
import { RequestReportComponent } from './components/manager-side/statistics/request-report/request-report.component';
import { TermsComponent } from './components/visual/terms/terms.component';
import { ViewInvoiceComponent } from './components/customer-side/view-invoice/view-invoice.component';
import { SalesReportComponent } from './components/manager-side/statistics/sales-report/sales-report.component';
import { CustomerReportComponent } from './components/manager-side/statistics/customer-report/customer-report.component';
import { AdminGuard } from './guards/admin.guard';
import { ManagerGuard } from './guards/manager.guard';

const routes: Routes = [
  { path: 'inicio', component: HomeComponent },
  { path: 'servicios', component: ServicesComponent },
  { path: 'repuestos', component: SparePartsComponent },
  { path: 'alquileres', component: RentalsComponent },
  { path: 'ofertas', component: OffersComponent },
  { path: 'ofertas/ver/:id', component: OfferDetailsCustomerComponent },
  { path: 'ofertas/solicitar/:id', component: OfferRequestComponent },
  { path: 'cancelarSolicitud/:token', component: CancelRequestComponent },
  { path: 'verPresupuesto/:token', component: ViewInvoiceComponent },
  { path: 'solicitudes', component: RequestsComponent, canActivate: [ManagerGuard] },
  {
    path: "gestion",
    canActivate: [ManagerGuard],
    children: [
      { path: 'ofertas', component: ManageOffersComponent },
      { path: 'ofertas/ver/:id', component: OfferDetailsComponent },
      { path: 'ofertas/nuevo', component: NewOfferComponent },
      { path: 'ofertas/editar/:id', component: EditOfferComponent },
      { path: 'proveedores', component: ManageSuppliersComponent },
      { path: 'proveedores/nuevo', component: NewSupplierComponent },
      { path: 'proveedores/editar/:id', component: EditSupplierComponent },
      { path: 'productos', component: ManageProductsComponent },
      { path: 'productos/nuevo', component: NewProductComponent },
      { path: 'productos/editar/:id', component: EditProductComponent },
      { path: 'maquinas', component: ManageRentablesComponent },
      { path: 'maquinas/nuevo', component: NewRentableComponent },
      { path: 'maquinas/editar/:id', component: EditRentableComponent },
      { path: 'solicitudes/alquileres/:id', component: DetailsRentalsComponent },
      { path: 'solicitudes/ofertas/:id', component: DetailsOffersComponent },
      { path: 'solicitudes/servicios/:id', component: DetailsServicesComponent },
      { path: 'solicitudes/repuestos/:id', component: DetailsSparePartsComponent },
      { path: 'generarPresupuesto/:id', component: InvoicesComponent },
      { path: '', component: NotFoundComponent },
    ]
  },
  {
    path: "estadisticas",
    canActivate: [ManagerGuard],
    children: [
      { path: '', component: StatisticsComponent },
      { path: 'solicitudes', component: RequestReportComponent },
      { path: 'ventas', component: SalesReportComponent },
      { path: 'clientes', component: CustomerReportComponent },
    ]
  },
  {
    path: "admin",
    canActivate: [AdminGuard],
    children: [
      { path: 'usuarios', component: ListUserComponent },
      { path: 'usuarios/nuevo', component: NewUserComponent },
      { path: 'usuarios/editar/:id', component: EditUserComponent },
      { path: '', component: NotFoundComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'perfil', component: ProfileComponent },
  { path: 'perfil/contraseña', component: ChangePasswordComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'nuestrosclientes', component: CustomersComponent },
  { path: 'home', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
