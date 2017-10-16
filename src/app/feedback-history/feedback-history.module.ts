import { FeedBackService } from './feedback-history.service';
import { FeedBackComponent } from './feedback-history.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { MomentModule } from 'angular2-moment';
import { MarkdownModule } from 'angular2-markdown';


@NgModule({
	declarations: [
	  FeedBackComponent
	],
	imports: [
	  CommonModule, HttpModule,  VirtualScrollModule, MomentModule, MarkdownModule.forRoot()
	],
	providers:[ FeedBackService],
	exports: [FeedBackComponent]
  })
  export class FeedBackModule {}
