import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { EntryType } from '../models/app_data_state';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { BaseService } from '../services/base.service';
@Component({
  selector: 'app-base',
  template: ` <p>base works!</p> `,
  styles: [],
})
export class BaseComponent<T extends EntryType> implements OnInit {
  private controlled!: T;

  constructor(
    public service: BaseService<T>,
    public router: Router,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {}

  openPage(routename: string) {
    this.router.navigateByUrl(routename);
  }
  public openDialog(entry: T) {
    console.log(
      typeof this.controlled,
      'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP'
    );
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { entry },
    });
    return dialogRef;
  }
}
