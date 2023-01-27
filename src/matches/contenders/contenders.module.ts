import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contender, ContenderSchema } from './schemas/contender.schema';
import { ContendersService } from './contenders.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contender.name, schema: ContenderSchema },
    ]),
  ],
  providers: [ContendersService],
  exports: [ContendersService],
})
export class ContendersModule {}
