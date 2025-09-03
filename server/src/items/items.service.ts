import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsService {
  constructor(@InjectRepository(Item) private itemsRepo: Repository<Item>) {}

  create(createItemDto: CreateItemDto) {
    const i = this.itemsRepo.create(createItemDto);
    return this.itemsRepo.save(i);
  }

  findAll() {
    return this.itemsRepo.find();
  }

  findOne(id: string) {
    return this.itemsRepo.findOneBy({ id });
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    await this.itemsRepo.update(id, updateItemDto);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.itemsRepo.delete(id);
  }
}
