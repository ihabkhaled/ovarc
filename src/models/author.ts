import { Table, Column, Model, DataType, HasMany, BelongsToMany } from 'sequelize-typescript';
import Book from './book';
import BookStore from './store_book';

@Table
class Author extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name!: string;

    @HasMany(() => Book)
    books!: Book[];
}

export default Author;