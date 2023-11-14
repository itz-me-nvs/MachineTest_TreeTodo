import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DropDownListModel } from './app.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  DropDownFormGroup: FormGroup = new FormGroup({});
  titleFormControl: FormControl = new FormControl('');
  index: number = 0;

  childrenList: string[] = [];

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar) {}

  dropdownValues: DropDownListModel[] = [];
  ngOnInit(): void {
    this.getDropDownValues(this.dropDrownList);

    this.DropDownFormGroup = this.fb.group({
      list: ['', Validators.required],
      title: ['', Validators.required],
    });

    this.DropDownFormGroup.get('list')?.valueChanges.subscribe((e) => {
      this.childrenList = [];
      this.findChildren(this.dropDrownList, e);
    });
  }

  dropDrownList: DropDownListModel[] = [];

  getDropDownValues(list: DropDownListModel[], type: number = 0) {
    list.forEach((el) => {
      if (type == 0) {
        this.dropdownValues.push({
          title: el.title,
          id: el.id,
        });
      } else {
        this.childrenList.push(el.title);
      }

      if (el.children) {
        this.getDropDownValues(el.children, type);
      }
    });
  }

  submitForm() {
    if (this.DropDownFormGroup.get('title')?.valid) {
      this.index = 0;

      if (
        this.dropDrownList.length > 0 &&
        this.DropDownFormGroup.get('list')?.valid
      ) {
        this.AddNewTitle(
          this.dropDrownList,
          this.DropDownFormGroup.get('list')?.value
        );

        this.childrenList = [];
        this.dropdownValues = [];
        this.findChildren(
          this.dropDrownList,
          this.DropDownFormGroup.get('list')?.value
        );

        this.getDropDownValues(this.dropDrownList);

        this.patchDynamicId(this.dropDrownList);
        this.DropDownFormGroup?.reset();
      } else {
        this.dropDrownList.push({
          id: 1,
          title: this.DropDownFormGroup.get('title')?.value,
          children: [],
        });

        this.getDropDownValues(this.dropDrownList);

        this.DropDownFormGroup?.reset();
      }
    } else {
      this._snackBar.open('Select all fields');
    }
  }

  findChildren(arr: DropDownListModel[] | any[], itemID: number): any {
    return arr.map((el) => {
      // this.childrenList.push(el.title);
      if (el.id == itemID) {
        // this.childrenList.push(el.title);
        this.getDropDownValues(el.children || [], 1);
        return el;
      } else {
        return this.findChildren(el.children, itemID);
      }
    });
  }

  AddNewTitle(arr: DropDownListModel[], itemID: number): any {
    return arr.map((el) => {
      if (el.id == itemID) {
        el.children?.push({
          id: 0,
          title: this.DropDownFormGroup.get('title')?.value,
          children: [],
        });

        return el;
      } else {
        return this.AddNewTitle(el.children as any, itemID);
      }
    });
  }

  patchDynamicId(arr: DropDownListModel[]) {
    arr.forEach((el) => {
      el.id = ++this.index;

      if (el.children) {
        this.patchDynamicId(el.children);
      }
    });
  }
}
