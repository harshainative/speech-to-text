import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { AudioRecordingService } from './audio-recording.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private data: BehaviorSubject<any> = new BehaviorSubject(false);
  public hasRemoteConnection: boolean = false;
  private hubConnection!: signalR.HubConnection;
  public transcription$: Observable<any> = this.data.asObservable();
  transcripts: string[] = [];


  constructor(private zone: NgZone, private http: HttpClient, 
    private audioRecordingService: AudioRecordingService) {

      this.audioRecordingService.audioBlob$.subscribe((blob: any) => {
        if(blob){
          console.log('calling broadcastParams(): ', blob);
          this.broadcastParams(blob);
        }
      })
  }

  updateData(value: any){
    this.data.next(value);
  }
  // Start Hub Connection and Register events
  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Trace)
      .withUrl('https://localhost:7044/SpeechHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();
    this.hubConnection
      .start()
      .then(() => {
        this.registerSignalEvents();
        // this.broadcastParams();
      })
      .catch(() => { });
  }
  // Change the parameters like frequency and data volume
  broadcastParams(blob: Blob) {
    // const file = new File([blob], "test.wav");
    // const formData: FormData = new FormData();
    // formData.append('file', file, file.name);  
    
    function blobToBase64(blob) {
      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }
    blobToBase64(blob).then((base64AudioData: any) => {
      console.log('base64AudioData: ', base64AudioData);
      console.log('calling speech to text');
      console.log('base64: ', base64AudioData.substr(base64AudioData.indexOf(',')+1));
      this.hubConnection.invoke('speechtotext', base64AudioData.substr(base64AudioData.indexOf(',')+1))
      .then(() => {console.log('Invoked speech to text');})
      .catch(err => {
        console.error(err);
      });
    })
  }
  // Register events
  registerSignalEvents() {
    this.hubConnection.onclose(() => {
      this.hasRemoteConnection = false;
      this.data.next([]);
    });
    this.hubConnection.on('transferdata', (data) => {
      this.data.next(data);
    })
  }
}