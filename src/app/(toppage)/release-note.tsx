'use client'

import PrimaryButton from '@/components/button/primary-button'
import Modal from '@/components/modal/modal'
import { useState } from 'react'

const ReleaseNote = () => {
  const [isShowReleaseNoteModal, setIsShowReleaseNoteModal] = useState(false)
  const openReleaseNoteModal = () => setIsShowReleaseNoteModal(true)
  const toggleReleaseNoteModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsShowReleaseNoteModal(!isShowReleaseNoteModal)
    }
  }

  return (
    <div className='my-2 w-full p-5'>
      <PrimaryButton click={openReleaseNoteModal}>更新履歴 </PrimaryButton>
      {isShowReleaseNoteModal && (
        <ReleaseNoteModal toggleModal={toggleReleaseNoteModal} />
      )}
    </div>
  )
}
export default ReleaseNote

const ReleaseNoteModal = ({
  toggleModal
}: {
  toggleModal: (e: any) => void
}) => {
  return (
    <Modal header='更新履歴' close={toggleModal}>
      <div className='text-left text-xs md:text-sm'>
        <ul className='text-xs leading-7'>
          <li>
            2024/11/09
            全ての表を再精査し、要不要に応じた内容表示、ソート・フィルター機能追加
          </li>
          <li>2024/11/09 別技術全て再構築</li>
          <li>
            2023/11/29
            同一シナリオの通過記録を上書きでなく別の通過記録として登録できるよう仕様変更
          </li>
          <li>
            2023/10/28 シナリオ選択などの検索で1文字入力すれば検索できるよう変更
          </li>
          <li>2023/05/10 シナリオ検索条件にPL人数を追加</li>
          <li>2023/02/08 Googleログインを追加</li>
          <li>2023/02/06 TwitterAPI利用機能を削除</li>
          <li>2023/01/05 感想シェア機能を追加</li>
          <li>2022/12/31 参加記録の並び替え機能を追加</li>
          <li>2022/12/26 参加記録の表示内容を改善</li>
          <li>
            2022/12/26
            シナリオ一覧の通過記録をフォローユーザーで絞れるよう機能追加
          </li>
          <li>2022/08/08 ユーザー削除機能追加</li>
          <li>2022/08/04 デザイン調整</li>
          <li>
            2022/07/22
            「このシナリオを通過した人がよく通過しているシナリオ」を追加
          </li>
          <li>2022/07/22 「人気のシナリオ」を追加</li>
          <li>2022/07/22 ルールブック種別に「リプレイ」を追加</li>
          <li>
            2022/07/22
            シナリオに任意項目「ゲームマスター要不要」「PL人数」「プレイ時間目安」を追加
          </li>
          <li>
            2022/07/22
            参加記録に任意項目「日程」「プレイ時間」「PL人数」「GM」「参加PL」「ひとことメモ」を追加
          </li>
          <li>2022/07/20 所有シナリオの一括登録機能追加</li>
          <li>2022/07/20 参加記録の一括登録機能追加</li>
          <li>2022/07/20 参加記録のルールブックを任意項目に変更</li>
          <li>2022/07/20 役割を自由記入に変更</li>
          <li>
            2022/07/19
            ユーザーページの見た目を変更（マダミス/TRPGをタブ切り替え、参加数が多い方を初期表示）
          </li>
          <li>2022/07/19 許可URLにクトゥルフ神話TRPGやろうずwikiを追加</li>
          <li>
            2022/07/18
            ゲームシステム、ルールブック、シナリオの削除・統合削除機能を追加
          </li>
          <li>2022/07/17 一覧にページングを追加</li>
          <li>
            2022/07/17
            一度感想を開くと他の感想を開いた際に前の感想が表示されてしまう不具合を修正
          </li>
          <li>2022/07/17 役割「PL」を追加、TRPGに「GM可」も追加</li>
          <li>2022/07/17 ネタバレ区分が常に「未通過NG」に見える不具合を修正</li>
          <li>2022/07/17 許可URLにDLSiteとBooth個人ショップを追加</li>
          <li>
            2022/07/17
            トップページからマダミスシナリオ一覧とTRPGシナリオ一覧で分岐
          </li>
          <li>2022/07/17 各一覧画面に検索条件を追加</li>
          <li>2022/07/17 参加記録を更新すると並び順が失われる不具合修正</li>
          <li>2022/07/17 ゲームシステムに検索用キーワードを追加</li>
          <li>
            2022/07/17
            マダミスの役割にPC9~12を追加、TRPGの役割にGMとHO9~12を追加
          </li>
          <li>2022/07/17 ユーザー検索条件に「フォロー中のユーザー」を追加</li>
          <li>2022/07/17 個別ページから編集できるように変更</li>
          <li>2022/07/16 一般公開</li>
        </ul>
      </div>
    </Modal>
  )
}
