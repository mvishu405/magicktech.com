import React from "react";
import Loadable from "react-loadable";
import DefaultLayout from "./containers/DefaultLayout";

function Loading() {
    return <div>Loading...</div>;
}

const Dashboard = Loadable({
    loader: () => import("./views/Dashboard"),
    loading: Loading,
});

const Quotelist = Loadable({
    loader: () => import("./views/Pages/Quotelist/Quotelist"),
    loading: Loading,
});

const Addquotelineitem = Loadable({
    loader: () => import("./views/Pages/Addquotelineitem/Addquotelineitem"),
    loading: Loading,
});

const Logout = Loadable({
    loader: () => import("./views/Logout/Logout"),
    loading: Loading,
});

const ManageDealers = Loadable({
    loader: () => import("./views/ManageDealers/Manage"),
    loading: Loading,
});
const AddUpdateDealers = Loadable({
    loader: () => import("./views/ManageDealers/AddUpdate"),
    loading: Loading,
});

const ManageCustomers = Loadable({
    loader: () => import("./views/ManageCustomers/Manage"),
    loading: Loading,
});

const AddUpdateCustomers = Loadable({
    loader: () => import("./views/ManageCustomers/AddUpdate"),
    loading: Loading,
});

const ManageAccessories = Loadable({
    loader: () => import("./views/ManageAccessories/Manage"),
    loading: Loading,
});

const AddUpdateAccessories = Loadable({
    loader: () => import("./views/ManageAccessories/AddUpdate"),
    loading: Loading,
});

const ManageDesigner = Loadable({
    loader: () => import("./views/ManageDesigner/Manage"),
    loading: Loading,
});

const AddUpdateDesigner = Loadable({
    loader: () => import("./views/ManageDesigner/AddUpdate"),
    loading: Loading,
});

const ManageComponent = Loadable({
    loader: () => import("./views/ManageComponent/Manage"),
    loading: Loading,
});

const AddUpdateComponent = Loadable({
    loader: () => import("./views/ManageComponent/AddUpdate"),
    loading: Loading,
});

const ManageCodes = Loadable({
    loader: () => import("./views/ManageCodes/Manage"),
    loading: Loading,
});

const AddUpdateCodes = Loadable({
    loader: () => import("./views/ManageCodes/AddUpdate"),
    loading: Loading,
});

const ManagePricemapping = Loadable({
    loader: () => import("./views/ManagePricemapping/Manage"),
    loading: Loading,
});

const AddUpdatePricemapping = Loadable({
    loader: () => import("./views/ManagePricemapping/AddUpdate"),
    loading: Loading,
});

const SpoQuote = Loadable({
    loader: () => import("./views/SpoQuote/Manage"),
    loading: Loading,
});

const ProductSelector = Loadable({
    loader: () => import("./views/ProductSelector/Manage"),
    loading: Loading,
});

const ManageWarrantyOrderForm = Loadable({
    loader: () => import("./views/ManageWarrantyOrderForm/Manage"),
    loading: Loading,
});

const AddUpdateWarrantyOrderForm = Loadable({
    loader: () => import("./views/ManageWarrantyOrderForm/AddUpdate"),
    loading: Loading,
});

/*
|--------------------------------------------------------------------------
| Category, Subcategory, Products |----------------------------------------
|--------------------------------------------------------------------------
|
*/
const ManageCategories = Loadable({
    loader: () => import("./views/ManageCategories/ManageCategories"),
    loading: Loading,
});

const AddUpdateCategories = Loadable({
    loader: () => import("./views/ManageCategories/AddUpdateCategories"),
    loading: Loading,
});

const ManageProducts = Loadable({
    loader: () => import("./views/ManageProducts/ManageProducts"),
    loading: Loading,
});

const AddUpdateProducts = Loadable({
    loader: () => import("./views/ManageProducts/AddUpdateProducts"),
    loading: Loading,
});

const routes = [
    //{ path: '/', exact: true, name: 'Home', component: DefaultLayout },
    { path: "/dashboard", name: "Dashboard", component: Dashboard },
    { path: "/quotelist", name: "Quote List", component: Quotelist },
    { path: "/Addquotelineitem", name: "Add Quote Item", component: Addquotelineitem },
    { path: "/logout", name: "Logout", component: Logout },
    { path: "/dealers/add", name: "Add Dealer", component: AddUpdateDealers },
    { path: "/dealers/edit", name: "Edit Dealer", component: AddUpdateDealers },
    { path: "/dealers", name: "Dealers", component: ManageDealers },
    { path: "/customers/add", name: "Add Customer", component: AddUpdateCustomers },
    { path: "/customers/edit", name: "Edit Customer", component: AddUpdateCustomers },
    { path: "/customers", name: "Customers", component: ManageCustomers },

    { path: "/accessories/add", name: "Add Accessories", component: AddUpdateAccessories },
    { path: "/accessories/edit", name: "Edit Accessories", component: AddUpdateAccessories },
    { path: "/accessories", name: "Accessories", component: ManageAccessories },

    { path: "/designer/add", name: "Add Designer", component: AddUpdateDesigner },
    { path: "/designer/edit", name: "Edit Designer", component: AddUpdateDesigner },
    { path: "/designer", name: "Designer", component: ManageDesigner },

    { path: "/component/add", name: "Add Component", component: AddUpdateComponent },
    { path: "/component/edit", name: "Edit Component", component: AddUpdateComponent },
    { path: "/component", name: "Component", component: ManageComponent },

    /*
    |--------------------------------------------------------------------------
    | Category, Subcategory, Products
    |--------------------------------------------------------------------------
    | From here I have started my routes
    |
    */

    { path: "/categories/add", name: "Add Categories", component: AddUpdateCategories },
    { path: "/categories/edit", name: "Edit Categories", component: AddUpdateCategories },
    { path: "/categories", name: "Categories", component: ManageCategories },

    { path: "/products/add", name: "Add Products", component: AddUpdateProducts },
    { path: "/products/edit", name: "Edit Products", component: AddUpdateProducts },
    { path: "/products", name: "Products", component: ManageProducts },

    /*
    |--------------------------------------------------------------------------
    | End of Code |------------------------------------------------------------
    |--------------------------------------------------------------------------
    |
    */

    { path: "/codes/add", name: "Add Code", component: AddUpdateCodes },
    { path: "/codes/edit", name: "Edit Code", component: AddUpdateCodes },
    { path: "/codes", name: "Codes", component: ManageCodes },

    { path: "/pricemapping/add", name: "Add Price", component: AddUpdatePricemapping },
    { path: "/pricemapping/edit", name: "Edit Price", component: AddUpdatePricemapping },
    { path: "/pricemapping", name: "Price Mapping", component: ManagePricemapping },
    { path: "/SpoQuote", name: "SpoQuote", component: SpoQuote },
    { path: "/productselector", name: "Product Selector", component: ProductSelector },

    { path: "/warrantyorderform/add", name: "Add Warranty", component: AddUpdateWarrantyOrderForm },
    { path: "/warrantyorderform/edit", name: "Edit Warranty", component: AddUpdateWarrantyOrderForm },
    { path: "/warrantyorderform", name: "Warranty", component: ManageWarrantyOrderForm },
];

export default routes;
