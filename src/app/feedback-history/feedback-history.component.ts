import { FeedBackService } from './feedback-history.service';
import { Component, Input , OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ChangeEvent } from 'angular2-virtual-scroll';


export interface MsgSlack {
    text?: string;
    ts?: string;

  }

@Component({
	selector: 'app-messages-history',
	template: `
	 <div class="container " style="margin-top: 20px;">
<div class="row">
<div class="col-12 col-md-12 col-sm-12">
              <!-- <div *ngIf="loading" class="loader">Loading...</div> -->
</div>
        <div class="row">
                <div class="col-12 col-md-12 col-sm-12">
                                <virtual-scroll
    [items]="buffer"  (update)="scrollItems = $event" (change)="indices = $event" (end)="fetchMore($event)" style="height: 75vh;
                                display: block; background-color: #FFFFFF;  ">

<div class="row">
                <div class="col-12 col-xs-12 col-sm-12 col-md-12">
                        <div *ngFor="let item of scrollItems">

                        <div class="card" id="card1" Markdown>
                        <div class="container">

                        <div class="row">
<div class="col-5 col-xs-5 col-sm-5 col-md-5" *ngIf="item[2].length == 1"> 
<i class="fa fa-user-circle fa-2x"  aria-hidden="true"></i>
 <strong>{{item[0]}}</strong><strong *ngIf="item[2].length == 0">Undefined User</strong>
</div>
                         <div class="col-2 col-xs-2 col-sm-2 col-md-2" >
                         <h6 id="mphone"><i class="fa fa-phone" aria-hidden="true"></i>
                         <small>{{item[2]}}</small><small *ngIf="item[2].length == 0">Undefined phone</small></h6></div>
                         // tslint:disable-next-line:max-line-length
                         // tslint:disable-next-line:max-line-length
                         <div class="col-2 col-xs-2 col-sm-2 col-md-2">
                         <h6 id="mlocation"><i class="fa fa-map-marker" aria-hidden="true"></i>
                         <small >{{item[1]}}</small><small *ngIf="item[2].length == 0">Undefined location</small></h6></div>
                          <div class="col-3 col-xs-3 col-sm-3 col-md-3">
                          <h6 id="mtime">
                          <small><strong>{{item[4] * 1000 | date:'MMM dd'}} at {{item[4] * 1000 | date:'HH:mm'}} &bull;
                           <i class="fa fa-clock-o" aria-hidden="true"></i> {{item[4]* 1000 | amTimeAgo }}</strong></small> </h6>
                          </div>
                         </div>
                         <div class="row">
                         <div class="col-12 col-xs-12 col-sm-12 col-md-12 ">
                                         <p *ngIf="item[2].length == 0" style="line-height: 20px; color: rgb(110, 110, 110)">{{item[0]}}</p>
                                                 <p class="text "  style="line-height: 20px; color: rgb(110, 110, 110)">{{item[3]}}</p>

                                 </div>
         </div>
                        </div>
                      </div>

                </div>
                </div>
                </div>

        </virtual-scroll>
        <div class="row" style="margin-top: 10px; margin-bottom: 50px;">
        <div class="col-12 col-md-12 col-sm-12">
          <button type="button" class="btn btn-primary " id="refresh_btn"  (click)="refreshTimeout()">
          Refresh &ensp; <i *ngIf="loading" class="fa fa-refresh fa-spin" aria-hidden="true"></i></button>
        </div>
</div>
                </div>
        </div>

        </div>

	`,
	styles: [`

      .loader {
          height: 4em;
          display:block;
          line-height:4em;
          text-align:center;
          position:relative;
         background-color:#F6F6F9;
        }
        .loader:before {
          content: ' ';
          position: absolute;
          top: 0;
          left: 0;
          width: 16.5%;
          height: 3px;
          background: #0029FF;
          animation: loader-animation 2s ease-out infinite;
        }
        @keyframes loader-animation {
          0% {
            transform: translate(0%);
          }
          100% {
            transform: translate(500%);
          }
        }

        .row {
          margin-bottom: 15px;

        }

        #refresh_btn {
          position: absolute;
          right: 16px;
        }
        #msg {
          position: absolute;
          left: 100px;
         }
         #card1 {
          margin-left: 0px;
          margin-right: 0px;
          margin-bottom: 10px;
           position: static;
          box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);

          border-radius: 5px; /* 5px rounded corners */
        }

        #mtime {
         position: absolute;
         right: 16px;
        }
	`, '../../../node_modules/font-awesome/css/font-awesome.css']
})

export class FeedBackComponent implements  OnInit, OnChanges {
	@Input() items: MsgSlack[];


    public d: any;
		protected indices: ChangeEvent;
		protected buffer: MsgSlack[];
		protected scrollItems: MsgSlack[];
		protected myItems: MsgSlack[];
		protected readonly bufferSize: number = 10;
    protected timer: any;
		protected loading: boolean;
		constructor(private _service: SeedService) {

  }

  public ngOnInit() {
    		this.slackMsg();
  }

  protected slackMsg() {
    this._service.getScrollMessages()
    .subscribe(res => {
      this.scrollItems = this._service.formatMsg(res.messages);

    });
  }

  protected refresh() {
    this._service.getScrollMessages().subscribe( res => { this.slackMsg(); });
   }
   public refreshTimeout() {

        this.loading = true;
        this.d = setTimeout(() => {
          this.refresh();

        }, 100);
        setTimeout(() => { this.loading = false; }, 4000 );

      }


	ngOnChanges(changes: SimpleChanges) {
		this.reset();
	}


		protected reset() {
			this.fetchNextChunk(0, this.bufferSize, {}).then(chunk => this.buffer = chunk);
		}

		protected fetchMore(event: ChangeEvent) {
			this.indices = event;
			if (event.end === this.buffer.length) {
				this.loading = true;
				this.fetchNextChunk(this.buffer.length, this.bufferSize, event).then(chunk => {
					this.buffer = this.buffer.concat(chunk);
					this.loading = false;
				}, () => this.loading = false);
			}
		}

		protected fetchNextChunk(skip: number, limit: number, event?: any): Promise< MsgSlack[]> {
			return new Promise((resolve, reject) => {
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					if (skip < this.items.length) {
						return resolve(this.items.slice(skip, skip + limit));
					}
					reject();
				}, 1000 + Math.random() * 1000);
			});
		}
	}
