import * as bluebird from 'bluebird'
import * as amqp from 'amqplib/callback_api'
import * as Rx from 'rx'
import { Channel } from "amqplib"

import { PoetBlockInfo, PoetTxInfo } from './events'
import { Block } from './model/claim'

const BITCOIN_BLOCK = 'bitcoinBlock'
const BITCOIN_TRANSACTION = 'bitcoinTransaction'
const DOWNLOAD_HASH = 'downloadHash'
const BLOCK_READY = 'blockReady'
const SEND_BLOCK = 'sendBlock'

const amqpConnect = bluebird.promisify(amqp.connect, amqp)

export class Queue {
  bitcoinBlock(): Rx.Observable<PoetBlockInfo> {
    return this.consume(BITCOIN_BLOCK) as Rx.Observable<PoetBlockInfo>
  }

  transactionHeard(): Rx.Observable<PoetTxInfo> {
    return this.consume(BITCOIN_TRANSACTION) as Rx.Observable<PoetTxInfo>
  }

  blocksToSend(): Rx.Observable<Block> {
    return this.consume(DOWNLOAD_HASH) as Rx.Observable<Block>
  }

  blockDownloaded(): Rx.Observable<Block> {
    return this.consume(BLOCK_READY) as Rx.Observable<Block>
  }

  announceBitcoinBlock(bitcoinBlock: PoetBlockInfo) {
    return this.publish(BITCOIN_BLOCK, bitcoinBlock)
  }

  announceBlockReady(block: Block) {
    return this.publish(BLOCK_READY, block)
  }

  announceBlockToSend(block: Block) {
    return this.publish(SEND_BLOCK, block)
  }

  announceBitcoinTransaction(poetTx: PoetTxInfo) {
    return this.publish(BITCOIN_TRANSACTION, poetTx)
  }

  private consume(target: string) {
    return Rx.Observable.create(async (observer: any) => {
      let connection, channel: Channel

      try {
        connection = await amqpConnect() as amqp.Connection
        channel = await bluebird.promisify(connection.createChannel.bind(connection))() as Channel
      } catch (error) {
        observer.onError(error)
        return
      }

      try {
        const queue = await channel.assertQueue('', { exclusive: true })
        await channel.assertExchange(target, 'fanout')
        await channel.bindQueue(queue.queue, target, '')
        await channel.consume(queue.queue, (msg) => {
          observer.onNext(JSON.parse(msg.content.toString()))
        }, { noAck: true  })
      } catch (error) {
        observer.onError(error)
        return
      }
      return bluebird.resolve()
    }).publish().refCount()
  }

  private async publish(target: string, payload: any) {
      let connection, channel
    try {
      connection = await amqpConnect() as amqp.Connection
      channel = await bluebird.promisify(connection.createChannel.bind(connection))() as Channel
      await channel.assertExchange(target, 'fanout', { durable: true })
      await channel.publish(target, '', new Buffer(JSON.stringify(payload)))
      return await channel.close()
    } catch (error) {
      console.log('Error publishing', error, error.stack)
      throw error
    }
  }

}