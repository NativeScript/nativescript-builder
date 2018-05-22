import {
  BuildEvent,
  Builder,
  BuilderConfiguration,
  BuilderContext,
} from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { exec } from 'child_process';

import { BuildNativeScriptSchema } from './schema';

export class NativeScriptBuilder implements Builder<BuildNativeScriptSchema> {

  constructor(public context: BuilderContext) { }

  run(builderConfig: BuilderConfiguration<BuildNativeScriptSchema>): Observable<BuildEvent> {
    const options = builderConfig.options;

    console.log(`[NativeScriptBuilder]: ${JSON.stringify(options)}`);

    return new Observable((obs) => {
      console.log(`[NativeScriptBuilder]: in subscribe`);

      const proc = exec(`tns run ${options.platform} --bundle`, (error) => {
        const msg = JSON.stringify(error)
        console.log("TNS ERROR: " + msg);
        obs.error(new Error(msg))
      });

      proc.stdout.on('data', function (data) {
        console.log(data);
      });

      return () => {
        console.log(`[NativeScriptBuilder]: unsubscribe -> killing child process!`);
        proc.kill();
      }
    })
  }
}

export default NativeScriptBuilder;
