import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from 'generated/prisma';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(ProductsService.name);


  async onModuleInit() {
    this.logger.log('Initializing Prisma Client...');
    await this.$connect();
  }
  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.product.create({
        data: createProductDto
    })
    
      return product;
    } catch (error) {
      this.logger.error('Error creating product', error);
      throw new RpcException({
        message: 'Error creating product',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
   
  }

 

    async findAll( paginationDto: PaginationDto ) {

      const { page = 1, limit = 10 } = paginationDto;
  
      const totalPages = await this.product.count({ where: { available: true } });
      const lastPage = Math.ceil( totalPages / limit );
  
      return {
        meta: {
          total: totalPages,
          page: page,
          lastPage: lastPage,
        },
        data: await this.product.findMany({
          skip: ( page - 1 ) * limit,
          take: limit,
          where: {
            available: true
          }
        }),
        
      }
    }

 async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id: id, available: true },
    });
    if (!product) {
      throw new RpcException({
        message: 'Product not found or is not available',
        status: HttpStatus.BAD_REQUEST
      });
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id: __, ...data } = updateProductDto;

    const product = await this.findOne(id);

   return this.product.update({
      where: { id: product.id },
      data: data,
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
