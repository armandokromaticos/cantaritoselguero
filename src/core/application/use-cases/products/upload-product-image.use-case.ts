import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import type { IProductRepository } from "../../../domain/repositories/product.repository.interface";
import { PRODUCT_REPOSITORY } from "../../../domain/repositories/product.repository.interface";
import { SupabaseService } from "../../../infrastructure/supabase/supabase.service";
import { ProductEntity } from "../../../domain/entities/product.entity";

const BUCKET = "product-images";

export interface UploadFileInput {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

@Injectable()
export class UploadProductImageUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly supabaseService: SupabaseService,
  ) {}

  async execute(
    productId: string,
    file: UploadFileInput,
  ): Promise<ProductEntity> {
    const existing = await this.productRepository.findById(productId);
    if (!existing) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    const ext = file.originalname.split(".").pop() ?? "jpg";
    const filePath = `${productId}/${randomUUID()}.${ext}`;

    const publicUrl = await this.supabaseService.uploadFile(
      BUCKET,
      filePath,
      file.buffer,
      file.mimetype,
    );

    return this.productRepository.update(productId, {
      image: publicUrl,
    } as Partial<ProductEntity>);
  }
}
