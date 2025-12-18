import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import  {ShopComponent} from './component/shop/shop.component';
import { BlogComponent } from './component/blog/blog.component';
import { AboutComponent } from './component/about/about.component';
import { LoginComponent } from './component/login/login.component';
import { CreatAcountComponent } from './component/creat-acount/creat-acount.component';
//صفحات الادمن
import { CreatproductComponent } from './component/creatproduct/creatproduct.component';
import { UpdatproductComponent } from './component/updatproduct/updatproduct.component';
import { AllproductComponent } from './component/allproduct/allproduct.component';
//الجارد
import { AdminGuard } from './guards/admin.guard';
export const routes: Routes = [
     {path:'',component:HomeComponent},
     {path:'shop',component:ShopComponent},
     {path:'blog',component:BlogComponent},
     {path:'about',component:AboutComponent},
     {path:'login', component:LoginComponent},
     {path:'create-account', component:CreatAcountComponent},
     {
          path:'admin',
          canActivate:[AdminGuard],
          children:[
     {path:'createproduct', component:CreatproductComponent},
     {path:'updateproduct/:id', component:UpdatproductComponent},
     {path:'allproduct', component:AllproductComponent},
]
     },
      { path: '**', redirectTo: '' }
];
