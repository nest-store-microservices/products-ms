import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class CreateProductDto {


    @IsString()
    public name:string;

    @IsString()
    @IsOptional()
    public description?:string;


    @IsNumber({        
        maxDecimalPlaces: 2,        
    })
    @IsPositive()
    @Min(0)
    @Type(() => Number)
    public price:number;

    @IsNumber()
    @IsPositive()
    @Min(0)
    @Type(() => Number)
    public stock:number;


    @IsOptional()
    @IsString()
    public createdAt: Date;

    @IsOptional()
    @IsString()
    public updatedAt: Date;

}
