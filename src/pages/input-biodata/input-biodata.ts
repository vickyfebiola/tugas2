import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';


@IonicPage()
@Component({
  selector: 'page-input-biodata',
  templateUrl: 'input-biodata.html'
})
export class InputBiodata {

   // Define FormBuilder /model properties
   public form                   : FormGroup;
   public biodataNamaDepan       : any;
   public biodataNamaBelakang    : any;
   public biodataJenisKelamin    : any;
   public biodataAlamat          : any;
   public biodataNoTelp          : any;
   public biodataEmail           : any;
   
   // Flag to be used for checking whether we are adding/editing an entry
   public isEdited               : boolean = false;
   // Flag to hide the form upon successful completion of remote operation
   public hideForm               : boolean = false;
   // Property to help ste the page title
   public pageTitle              : string;
   // Property to store the recordID for when an existing entry is being edited
   public idBiodata               : any      = null;
   private baseURI               : string  = "http://localhost:8080/ionic-php-biodata/";

   // Initialise module classes
   constructor(public navCtrl    : NavController,
               public http       : Http,
               public NP         : NavParams,
               public fb         : FormBuilder,
               public toastCtrl  : ToastController)
   {

      // Create form builder validation rules
      this.form = fb.group({
         "namaDepan"                  : ["", Validators.required],
         "namaBelakang"               : ["", Validators.required],
         "jenisKelamin"               : ["", Validators.required],
         "alamat"                     : ["", Validators.required],
         "noTelp"                     : ["", Validators.required],
         "email"                      : ["", Validators.required]
      });
   }



   // Determine whether we adding or editing a record
   // based on any supplied navigation parameters
   ionViewWillEnter()
   {
      this.resetFields();

      if(this.NP.get("record"))
      {
         this.isEdited      = true;
         this.selectEntry(this.NP.get("record"));
         this.pageTitle     = 'Kembali';
      }
      else
      {
         this.isEdited      = false;
         this.pageTitle     = 'Input Data';
      }
   }



   // Assign the navigation retrieved data to properties
   // used as models on the page's HTML form
   selectEntry(item)
   {
      this.biodataNamaDepan        = item.namaDepan;
      this.biodataNamaBelakang     = item.namaBelakang;
      this.biodataJenisKelamin     = item.jenisKelamin;
      this.biodataAlamat           = item.alamat;
      this.biodataNoTelp           = item.noTelp;
      this.biodataEmail            = item.email;
      this.idBiodata               = item.idBiodata;
   }



   // Save a new record that has been added to the page's HTML form
   // Use angular's http post method to submit the record data
   // to our remote PHP script (note the body variable we have created which
   // supplies a variable of key with a value of create followed by the key/value pairs
   // for the record data
   createEntry(namaDepan, namaBelakang, jenisKelamin, alamat, noTelp, email)
   {
      let body     : string   = "key=create&namaDepan=" + namaDepan + "&namaBelakang=" + namaBelakang +
                                "&jenisKelamin=" + jenisKelamin + "&alamat=" + alamat + "&noTelp=" + noTelp + "&email=" + email,
          type     : string   = "application/x-www-form-urlencoded; charset=UTF-8",
          headers  : any      = new Headers({ 'Content-Type': type}),
          options  : any      = new RequestOptions({ headers: headers }),
          url      : any      = this.baseURI + "manage.php";

      this.http.post(url, body, options)
      .subscribe((data) =>
      {
         // If the request was successful notify the user
         if(data.status === 200)
         {
            this.hideForm   = true;
            this.sendNotification(`Data telah disimpan`);
         }
         // Otherwise let 'em know anyway
         else
         {
            this.sendNotification('Terdapat sesuatu kesalahan!');
         }
      });
   }



   // Update an existing record that has been edited in the page's HTML form
   // Use angular's http post method to submit the record data
   // to our remote PHP script (note the body variable we have created which
   // supplies a variable of key with a value of update followed by the key/value pairs
   // for the record data
   updateEntry(namaDepan, namaBelakang, jenisKelamin, alamat, noTelp, email)
   {
    let body     : string   = "key=create&namdepan=" + namaDepan + "&namaBelakang=" + namaBelakang +
                            "&jenisKelamin=" + jenisKelamin + "&alamat=" + alamat + "&noTelp=" + noTelp + "&email=" + email,
          type       : string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers    : any     = new Headers({ 'Content-Type': type}),
          options    : any     = new RequestOptions({ headers: headers }),
          url        : any     = this.baseURI + "manage.php";

      this.http.post(url, body, options)
      .subscribe(data =>
      {
         // If the request was successful notify the user
         if(data.status === 200)
         {
            this.hideForm  =  true;
            this.sendNotification(`Data telah diupdate`);
         }
         // Otherwise let 'em know anyway
         else
         {
            this.sendNotification('Terdapat sesuatu kesalahan!');
         }
      });
   }



   // Remove an existing record that has been selected in the page's HTML form
   // Use angular's http post method to submit the record data
   // to our remote PHP script (note the body variable we have created which
   // supplies a variable of key with a value of delete followed by the key/value pairs
   // for the record ID we want to remove from the remote database
   deleteEntry()
   {
      let body       : string    = "key=delete&idBiodata=" + this.idBiodata,
          type       : string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers    : any    = new Headers({ 'Content-Type': type}),
          options    : any    = new RequestOptions({ headers: headers }),
          url        : any    = this.baseURI + "manage.php";

      this.http.post(url, body, options)
      .subscribe(data =>
      {
         // If the request was successful notify the user
         if(data.status === 200)
         {
            this.hideForm     = true;
            this.sendNotification(`Data telah dihapus`);
         }
         // Otherwise let 'em know anyway
         else
         {
            this.sendNotification('Terdapat sesuatu kesalahan!');
         }
      });
   }



   // Handle data submitted from the page's HTML form
   // Determine whether we are adding a new record or amending an
   // existing record
   saveEntry()
   {
      let namaDepan         : string = this.form.controls["namaDepan"].value,
          namaBelakang      : string = this.form.controls["namaBelakang"].value,
          jenisKelamin      : string = this.form.controls["jenisKelamin"].value,
          alamat            : string = this.form.controls["alamat"].value,
          noTelp            : string = this.form.controls["noTelp"].value,
          email             : string = this.form.controls["email"].value;

          console.log("You click here")
      if(this.isEdited)
      {
         this.updateEntry(namaDepan, namaBelakang, jenisKelamin, alamat, noTelp, email);
      }
      else
      {
         this.createEntry(namaDepan, namaBelakang, jenisKelamin, alamat, noTelp, email);
      }
   }



   // Clear values in the page's HTML form fields
   resetFields() : void
   {
      this.biodataNamaDepan       = "";
      this.biodataNamaBelakang    = "";
      this.biodataJenisKelamin    = "";
      this.biodataAlamat          = "";
      this.biodataNoTelp          = "";
      this.biodataEmail           = "";
      
   }



   // Manage notifying the user of the outcome
   // of remote operations
   sendNotification(message)  : void
   {
      let notification = this.toastCtrl.create({
          message       : message,
          duration      : 3000
      });
      notification.present();
   }



}