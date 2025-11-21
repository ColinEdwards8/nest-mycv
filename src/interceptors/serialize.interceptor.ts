import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
    new (...args: any[]): {}
}

export const Serialize = (dto: ClassConstructor) => {return UseInterceptors(new SerializeInterceptor(dto))}

export class SerializeInterceptor implements NestInterceptor{
    constructor(private dto: any) {}

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        return handler.handle().pipe(
            map((data: any)=> {
                return plainToInstance(this.dto, data, { //plainToClass is now plainToInstance from class-transformer docs https://github.com/typestack/class-transformer?tab=readme-ov-file#plaintoinstance
                    excludeExtraneousValues: true,
                })
            })
        )
    }
}