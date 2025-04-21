import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from 'generated/prisma';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(ProductsService.name);


  async onModuleInit() {
    this.logger.log('Initializing Prisma Client...');
    await this.$connect();
  }
  create(createProductDto: CreateProductDto) {

    return this.product.create({
        data: createProductDto
    })
  }

 async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const totalRecords = await this.product.count({
      where: { available: true },
    });
    const lastPage = Math.ceil(totalRecords / limit);
    if (page > lastPage) {
      throw new Error('Page not found');
    }
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }

    return {
      totalRecords,
      page,
      limit: limit,
      lastPage,
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: page,
        where: { available: true },
      }),
    }
  }

 async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id: id, available: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

   return this.product.update({
      where: { id: product.id },
      data: updateProductDto,
    })

  }

  async remove(id: number) {
    const product = await this.findOne(id);
  /*   return this.product.delete({
      where: { id: product.id },
    }) */
    return this.product.update({
      where: { id: product.id },
      data: { available: false },
    })


  }
}
