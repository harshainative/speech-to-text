import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AudioRecordingService } from '../audio-recording.service';
import { SignalRService } from '../signal-r.service';

@Component({
  selector: 'app-speech-to-text',
  templateUrl: './speech-to-text.component.html',
  styleUrl: './speech-to-text.component.scss'
})
export class SpeechToTextComponent implements OnInit {


  isRecording = false;
  audioURL: string | null = null;
  success: boolean = false;
  response: any;
  transcripts: string[] = [];
  // @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  constructor(private audioRecordingService: AudioRecordingService, 
    private cd: ChangeDetectorRef,
    public signalRService: SignalRService) { }

  ngOnInit() {
    this.signalRService.startConnection();
    // this.audioRecordingService.audioBlob$.subscribe(blob => {
    //   this.audioURL = window.URL.createObjectURL(blob);
    //   this.audioPlayer.nativeElement.src = this.audioURL;
    //   this.cd.detectChanges();
    // });

    // this.audioRecordingService.audioBlob$.subscribe((blob: any) => {
    //   this.getTranscription(blob);
    // })

    this.signalRService.transcription$.subscribe((res: any) => {
      if(res){
        this.signalRService.transcripts = this.signalRService.transcripts.concat(res);
        this.cd.detectChanges();
      }
    })

  }

  startRecording() {
    this.isRecording = true;
    this.audioRecordingService.startRecording();
  }

  startStreamRecording(){
    this.isRecording = true;
    this.audioRecordingService.startStreamRecording();
  }

  // startStreamRecordingLPCM(){
  //   this.isRecording = true;
  //   this.audioRecordingService.startStreamRecordingLPCM();
  // }

  stopRecording() {
    this.isRecording = false;
    this.audioRecordingService.stopRecording();
  }

  stopStreamingRecording(){
    this.isRecording = false;
    this.audioRecordingService.stopStreamingRecording();
    this.signalRService.transcripts = [];
    this.cd.detectChanges();    
  }

  getTranscription(blob: any){
    const file = new File([blob], "test.wav");
    this.success = false;
    this.audioRecordingService.getTranscription(file).subscribe((res: any) => {
      this.success = true;
      this.response = res;
      this.cd.detectChanges();
      console.log(res);
    });
  }
}