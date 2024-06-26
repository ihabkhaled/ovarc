import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Store from './store';
import Book from './book';
import Author from './author';

@Table
class BookStore extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id!: number;

    @ForeignKey(() => Book)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    bookId!: number;

    @ForeignKey(() => Store)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    storeId!: number;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    price!: number;
}

export default BookStore;