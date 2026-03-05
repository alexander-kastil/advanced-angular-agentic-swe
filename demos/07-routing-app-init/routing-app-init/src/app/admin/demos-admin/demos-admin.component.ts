import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DemoService } from '../../demos/demo-base/demo.service';

@Component({
  selector: 'app-demos-admin',
  templateUrl: './demos-admin.component.html',
  styleUrls: ['./demos-admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemosAdminComponent implements OnInit {
  constructor(private service: DemoService) { }

  ngOnInit() { }

  uploadDemos() { }
}
