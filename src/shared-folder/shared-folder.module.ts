import { Module } from '@nestjs/common';
import { SharedFolderController } from './controllers';

@Module({
  controllers: [SharedFolderController],
  providers: [],
  exports: [],
})
export class SharedFolderModule {}
