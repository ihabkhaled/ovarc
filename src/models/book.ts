import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import Author from './author';
import Store from './store';
import BookStore from './store_book';

@Table
class Book extends Model {
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

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    pages!: number;

    @ForeignKey(() => Author)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    authorId!: number;

    @BelongsTo(() => Author)
    author!: Author;

    @BelongsToMany(() => Store, () => BookStore)
    stores!: Store[];
}

export default Book;