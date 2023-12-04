import { LOCALE_ID, NgModule } from '@angular/core';
import * as es from '@angular/common/locales/es-AR'
import { DatePipe, registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/visual/navbar/navbar.component';
import { NotFoundComponent } from './components/visual/not-found/not-found.component';
import { NewUserComponent } from './components/admin-side/users/new-user/new-user.component';
import { ListUserComponent } from './components/admin-side/users/list-user/list-user.component';
import { DeleteUserComponent } from './components/admin-side/users/delete-user/delete-user.component';
import { ServicesComponent } from './components/customer-side/services/services.component';
import { SparePartsComponent } from './components/customer-side/spare-parts/spare-parts.component';
import { RentalsComponent } from './components/customer-side/rentals/rentals.component';
import { OffersComponent } from './components/customer-side/offers/offers.component';
import { ManageOffersComponent } from './components/manager-side/manage-offers/manage-offers.component';
import { ManageSuppliersComponent } from './components/manager-side/manage-suppliers/manage-suppliers.component';
import { ManageProductsComponent } from './components/manager-side/manage-products/manage-products.component';
import { RequestsComponent } from './components/manager-side/requests/requests.component';
import { StatisticsComponent } from './components/manager-side/statistics/statistics.component';
import { UserService } from './services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { EditUserComponent } from './components/admin-side/users/edit-user/edit-user.component';
import { NewSupplierComponent } from './components/manager-side/manage-suppliers/new-supplier/new-supplier.component';
import { DeleteSupplierComponent } from './components/manager-side/manage-suppliers/delete-supplier/delete-supplier.component';
import { EditSupplierComponent } from './components/manager-side/manage-suppliers/edit-supplier/edit-supplier.component';
import { DeleteProductComponent } from './components/manager-side/manage-products/delete-product/delete-product.component';
import { EditProductComponent } from './components/manager-side/manage-products/edit-product/edit-product.component';
import { NewProductComponent } from './components/manager-side/manage-products/new-product/new-product.component';
import { TypeService } from './services/type.service';
import { SupplierService } from './services/supplier.service';
import { ProductService } from './services/product.service';
import { LoginComponent } from './components/session/login/login.component';
import { ChangePasswordComponent } from './components/session/change-password/change-password.component';
import { LogoutButtonComponent } from './components/session/logout-button/logout-button.component';
import { ProfileComponent } from './components/session/profile/profile.component';
import { ManageRentablesComponent } from './components/manager-side/manage-rentables/manage-rentables.component';
import { NewRentableComponent } from './components/manager-side/manage-rentables/new-rentable/new-rentable.component';
import { EditRentableComponent } from './components/manager-side/manage-rentables/edit-rentable/edit-rentable.component';
import { DeleteRentableComponent } from './components/manager-side/manage-rentables/delete-rentable/delete-rentable.component';
import { MachineService } from './services/machine.service';
import { EditOfferComponent } from './components/manager-side/manage-offers/edit-offer/edit-offer.component';
import { NewOfferComponent } from './components/manager-side/manage-offers/new-offer/new-offer.component';
import { CancelOfferComponent } from './components/manager-side/manage-offers/cancel-offer/cancel-offer.component';
import { ProductCardComponent } from './components/manager-side/manage-offers/product-card/product-card.component';
import { OfferService } from './services/offer.service';
import { RentalService } from './services/rental.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DetailsRentalsComponent } from './components/manager-side/requests/details-rentals/details-rentals.component';
import { DetailsServicesComponent } from './components/manager-side/requests/details-services/details-services.component';
import { DetailsSparePartsComponent } from './components/manager-side/requests/details-spare-parts/details-spare-parts.component';
import { DetailsOffersComponent } from './components/manager-side/requests/details-offers/details-offers.component';
import { RequestService } from './services/request.service';
import { CancelRequestComponent } from './components/customer-side/cancel-request/cancel-request.component';
import { OfferDetailsComponent } from './components/manager-side/manage-offers/offer-details/offer-details.component';
import { OfferDetailsCustomerComponent } from './components/customer-side/offers/offer-details-customer/offer-details-customer.component';
import { FooterComponent } from './components/visual/footer/footer.component';
import { FaqComponent } from './components/visual/faq/faq.component';
import { CustomersComponent } from './components/visual/customers/customers.component';
import { OfferRequestComponent } from './components/customer-side/offers/offer-request/offer-request.component';
import { InvoicesComponent } from './components/manager-side/invoices/invoices.component';
import { RequestReportComponent } from './components/manager-side/statistics/request-report/request-report.component';
import { BarChartComponent } from './components/manager-side/statistics/bar-chart/bar-chart.component';
import { PieChartComponent } from './components/manager-side/statistics/pie-chart/pie-chart.component';
import { TermsComponent } from './components/visual/terms/terms.component';
import { ReportService } from './services/report.service';
import { ServiceService } from './services/service.service';
import { SparePartService } from './services/spare-part.service';
import { ViewInvoiceComponent } from './components/customer-side/view-invoice/view-invoice.component';
import { InvoiceService } from './services/invoice.service';
import { ViewInvoiceManagerComponent } from './components/manager-side/invoices/view-invoice-manager/view-invoice-manager.component';
import { EditInvoiceDetailComponent } from './components/manager-side/invoices/edit-invoice-detail/edit-invoice-detail.component';
import { SalesReportComponent } from './components/manager-side/statistics/sales-report/sales-report.component';
import { CustomerReportComponent } from './components/manager-side/statistics/customer-report/customer-report.component';
import { LoginEventService } from './services/login-event.service';
import { MarkSoldOfferComponent } from './components/manager-side/manage-offers/mark-sold-offer/mark-sold-offer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    NotFoundComponent,
    NewUserComponent,
    ListUserComponent,
    DeleteUserComponent,
    ServicesComponent,
    SparePartsComponent,
    RentalsComponent,
    OffersComponent,
    ManageOffersComponent,
    ManageSuppliersComponent,
    ManageProductsComponent,
    RequestsComponent,
    StatisticsComponent,
    EditUserComponent,
    NewSupplierComponent,
    DeleteSupplierComponent,
    EditSupplierComponent,
    DeleteProductComponent,
    EditProductComponent,
    NewProductComponent,
    LoginComponent,
    ChangePasswordComponent,
    LogoutButtonComponent,
    ProfileComponent,
    ManageRentablesComponent,
    NewRentableComponent,
    EditRentableComponent,
    DeleteRentableComponent,
    EditOfferComponent,
    NewOfferComponent,
    CancelOfferComponent,
    ProductCardComponent,
    DetailsRentalsComponent,
    DetailsServicesComponent,
    DetailsSparePartsComponent,
    DetailsOffersComponent,
    CancelRequestComponent,
    OfferDetailsComponent,
    OfferDetailsCustomerComponent,
    FooterComponent,
    FaqComponent,
    CustomersComponent,
    OfferRequestComponent,
    InvoicesComponent,
    RequestReportComponent,
    BarChartComponent,
    PieChartComponent,
    TermsComponent,
    ViewInvoiceComponent,
    ViewInvoiceManagerComponent,
    EditInvoiceDetailComponent,
    SalesReportComponent,
    CustomerReportComponent,
    MarkSoldOfferComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    UserService, TypeService, SupplierService, SparePartService,
    ProductService, MachineService, OfferService, InvoiceService,
    RentalService, RequestService, ReportService, ServiceService,
    LoginEventService,
    { provide: LOCALE_ID, useValue: 'es-AR' }, DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(es.default);
  }
}
