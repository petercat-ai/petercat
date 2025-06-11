import I18N from '@/app/utils/I18N';
import { useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Chip,
} from '@nextui-org/react';
import { PageParams, RAGKnowledge } from '@/app/services/RAGController';
import { useKnowledgeList } from '@/app/hooks/useRAG';
import MySpinner from '@/components/Spinner';

export default function KnowledgeList({ repo_name }: { repo_name: string }) {
  const [pageParams, setPageParams] = useState<PageParams<RAGKnowledge>>({
    page: 1,
    page_size: 10,
    order_direction: 'asc',
    eq_conditions: {
      space_id: repo_name,
    },
  });

  const { data, isLoading } = useKnowledgeList(pageParams);
  return (
    <div className="w-full flex-1 px-4 py-6 flex flex-col min-h-[calc(100vh-200px)]">
      <MySpinner loading={isLoading}>
        <div className="flex-grow">
          <Table aria-label="Knowledge list table" className="min-w-full">
            <TableHeader>
              <TableColumn>
                {I18N.components.KnowledgeList.zhiShiMing}
              </TableColumn>
              <TableColumn>{I18N.components.KnowledgeList.leiXing}</TableColumn>
              <TableColumn>
                {I18N.components.KnowledgeList.zhiShiLaiYuan}
              </TableColumn>
              <TableColumn>
                {I18N.components.KnowledgeList.xiangLiangHuaMoXing}
              </TableColumn>
              <TableColumn>{I18N.components.KnowledgeList.daXiao}</TableColumn>
              <TableColumn>
                {I18N.components.KnowledgeList.keYongZhuangTai}
              </TableColumn>
            </TableHeader>
            <TableBody>
              {!data || !data.items ? (
                <></>
              ) : (
                data.items
                  .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <a
                          href={`/knowledge/chunk?knowledge_id=${item.knowledge_id}`}
                        >
                          {item.knowledge_name}
                        </a>
                      </TableCell>
                      <TableCell>{item.knowledge_type}</TableCell>
                      <TableCell>{item.source_type}</TableCell>
                      <TableCell>{item.embedding_model_name}</TableCell>
                      <TableCell>
                        {item.file_size
                          ? `${(item.file_size / 1024).toFixed(2)} KB`
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          color={item.enabled ? 'success' : 'danger'}
                          variant="flat"
                          size="sm"
                        >
                          {item.enabled ? 'Enabled' : 'Disabled'}
                        </Chip>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>
        {data && (
          <div className="mt-auto pt-4">
            <Pagination
              total={data.total_pages}
              page={pageParams.page}
              onChange={(page) => {
                setPageParams((prevParams) => ({
                  ...prevParams,
                  page: page,
                }));
              }}
              className="flex justify-center"
              initialPage={1}
              size="lg"
              classNames={{
                cursor: 'bg-gray-700',
              }}
            />
          </div>
        )}
      </MySpinner>
    </div>
  );
}
